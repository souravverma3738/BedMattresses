from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'pascal-beds-secret-key-2024')
JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str

class ProductBase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    short_description: str
    category: str  # divan-beds, bed-frames, ottoman-beds, mattresses
    price: float
    sale_price: Optional[float] = None
    images: List[str]
    sizes: List[str] = ["Single", "Small Double", "Double", "King", "Super King"]
    colors: List[str] = []
    storage_options: List[str] = []
    features: List[str] = []
    delivery_time: str = "3-5 working days"
    in_stock: bool = True
    rating: float = 4.5
    review_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    product_id: str
    rating: int = Field(ge=1, le=5)
    title: str
    content: str

class ReviewResponse(BaseModel):
    id: str
    product_id: str
    user_id: str
    user_name: str
    rating: int
    title: str
    content: str
    created_at: str
    verified_purchase: bool = False

class CartItem(BaseModel):
    product_id: str
    quantity: int
    size: str
    color: Optional[str] = None
    storage_option: Optional[str] = None

class CartUpdate(BaseModel):
    items: List[CartItem]

class AddressInfo(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    county: str
    postcode: str

class OrderCreate(BaseModel):
    shipping_address: AddressInfo
    billing_address: Optional[AddressInfo] = None
    items: List[CartItem]

class NewsletterSubscribe(BaseModel):
    email: EmailStr

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str

class CheckoutRequest(BaseModel):
    origin_url: str
    order_id: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 7  # 7 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
        return user
    except:
        return None

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    return user

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register")
async def register(data: UserCreate):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": data.email,
        "password": hash_password(data.password),
        "first_name": data.first_name,
        "last_name": data.last_name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id, data.email)
    return {"token": token, "user": {"id": user_id, "email": data.email, "first_name": data.first_name, "last_name": data.last_name}}

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"])
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "first_name": user["first_name"], "last_name": user["last_name"]}}

@api_router.get("/auth/me")
async def get_me(user=Depends(require_auth)):
    return {"id": user["id"], "email": user["email"], "first_name": user["first_name"], "last_name": user["last_name"]}

# ==================== PRODUCTS ROUTES ====================

@api_router.get("/products")
async def get_products(category: Optional[str] = None, search: Optional[str] = None, limit: int = 50):
    query = {}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return products

@api_router.get("/products/featured")
async def get_featured_products():
    products = await db.products.find({}, {"_id": 0}).limit(8).to_list(8)
    return products

@api_router.get("/products/category/{category}")
async def get_products_by_category(category: str, sort: str = "default", min_price: Optional[float] = None, max_price: Optional[float] = None):
    query = {"category": category}
    
    if min_price is not None:
        query["price"] = {"$gte": min_price}
    if max_price is not None:
        if "price" in query:
            query["price"]["$lte"] = max_price
        else:
            query["price"] = {"$lte": max_price}
    
    sort_options = {"default": [("created_at", -1)], "price-low": [("price", 1)], "price-high": [("price", -1)], "rating": [("rating", -1)]}
    sort_by = sort_options.get(sort, sort_options["default"])
    
    products = await db.products.find(query, {"_id": 0}).sort(sort_by).to_list(100)
    return products

@api_router.get("/products/{slug}")
async def get_product(slug: str):
    product = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# ==================== REVIEWS ROUTES ====================

@api_router.get("/reviews/{product_id}")
async def get_product_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return reviews

@api_router.post("/reviews")
async def create_review(data: ReviewCreate, user=Depends(require_auth)):
    review_doc = {
        "id": str(uuid.uuid4()),
        "product_id": data.product_id,
        "user_id": user["id"],
        "user_name": f"{user['first_name']} {user['last_name'][0]}.",
        "rating": data.rating,
        "title": data.title,
        "content": data.content,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "verified_purchase": False
    }
    await db.reviews.insert_one(review_doc)
    
    # Update product rating
    reviews = await db.reviews.find({"product_id": data.product_id}).to_list(1000)
    avg_rating = sum(r["rating"] for r in reviews) / len(reviews)
    await db.products.update_one({"id": data.product_id}, {"$set": {"rating": round(avg_rating, 1), "review_count": len(reviews)}})
    
    return {"id": review_doc["id"], "product_id": review_doc["product_id"], "user_id": review_doc["user_id"], "user_name": review_doc["user_name"], "rating": review_doc["rating"], "title": review_doc["title"], "content": review_doc["content"], "created_at": review_doc["created_at"], "verified_purchase": review_doc["verified_purchase"]}

@api_router.get("/reviews/site/all")
async def get_site_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).limit(10).to_list(10)
    return reviews

# ==================== CART ROUTES ====================

@api_router.get("/cart")
async def get_cart(user=Depends(get_current_user)):
    if not user:
        return {"items": [], "total": 0}
    
    cart = await db.carts.find_one({"user_id": user["id"]}, {"_id": 0})
    if not cart:
        return {"items": [], "total": 0}
    
    # Populate product details
    items_with_details = []
    total = 0
    for item in cart.get("items", []):
        product = await db.products.find_one({"id": item["product_id"]}, {"_id": 0})
        if product:
            price = product.get("sale_price") or product["price"]
            item_total = price * item["quantity"]
            total += item_total
            items_with_details.append({**item, "product": product, "item_total": item_total})
    
    return {"items": items_with_details, "total": total}

@api_router.post("/cart/add")
async def add_to_cart(item: CartItem, user=Depends(require_auth)):
    cart = await db.carts.find_one({"user_id": user["id"]})
    
    if not cart:
        cart = {"user_id": user["id"], "items": []}
    
    # Check if item already exists
    found = False
    for existing in cart["items"]:
        if (existing["product_id"] == item.product_id and 
            existing["size"] == item.size and 
            existing.get("color") == item.color and 
            existing.get("storage_option") == item.storage_option):
            existing["quantity"] += item.quantity
            found = True
            break
    
    if not found:
        cart["items"].append(item.model_dump())
    
    await db.carts.update_one({"user_id": user["id"]}, {"$set": cart}, upsert=True)
    return {"message": "Item added to cart"}

@api_router.put("/cart")
async def update_cart(data: CartUpdate, user=Depends(require_auth)):
    await db.carts.update_one({"user_id": user["id"]}, {"$set": {"items": [i.model_dump() for i in data.items]}}, upsert=True)
    return {"message": "Cart updated"}

@api_router.delete("/cart/item/{product_id}")
async def remove_from_cart(product_id: str, size: str, user=Depends(require_auth)):
    cart = await db.carts.find_one({"user_id": user["id"]})
    if cart:
        cart["items"] = [i for i in cart["items"] if not (i["product_id"] == product_id and i["size"] == size)]
        await db.carts.update_one({"user_id": user["id"]}, {"$set": {"items": cart["items"]}})
    return {"message": "Item removed"}

@api_router.delete("/cart")
async def clear_cart(user=Depends(require_auth)):
    await db.carts.delete_one({"user_id": user["id"]})
    return {"message": "Cart cleared"}

# ==================== ORDERS ROUTES ====================

@api_router.post("/orders")
async def create_order(data: OrderCreate, user=Depends(require_auth)):
    # Calculate totals
    subtotal = 0
    order_items = []
    for item in data.items:
        product = await db.products.find_one({"id": item.product_id}, {"_id": 0})
        if product:
            price = product.get("sale_price") or product["price"]
            order_items.append({**item.model_dump(), "price": price, "product_name": product["name"]})
            subtotal += price * item.quantity
    
    # Free delivery over £500
    delivery = 0 if subtotal >= 500 else 39.99
    total = subtotal + delivery
    
    order_id = str(uuid.uuid4())
    order_doc = {
        "id": order_id,
        "user_id": user["id"],
        "user_email": user["email"],
        "items": order_items,
        "shipping_address": data.shipping_address.model_dump(),
        "billing_address": data.billing_address.model_dump() if data.billing_address else data.shipping_address.model_dump(),
        "subtotal": subtotal,
        "delivery": delivery,
        "total": total,
        "status": "pending_payment",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.orders.insert_one(order_doc)
    
    return {"order_id": order_id, "total": total, "delivery": delivery, "subtotal": subtotal}

@api_router.get("/orders")
async def get_user_orders(user=Depends(require_auth)):
    orders = await db.orders.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user=Depends(require_auth)):
    order = await db.orders.find_one({"id": order_id, "user_id": user["id"]}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ==================== PAYMENT ROUTES (STRIPE) ====================

@api_router.post("/checkout/create-session")
async def create_checkout_session(data: CheckoutRequest, request: Request, user=Depends(require_auth)):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
    
    order = await db.orders.find_one({"id": data.order_id, "user_id": user["id"]}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Payment not configured")
    
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    success_url = f"{data.origin_url}/order-confirmation?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{data.origin_url}/checkout"
    
    checkout_request = CheckoutSessionRequest(
        amount=float(order["total"]),
        currency="gbp",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"order_id": data.order_id, "user_id": user["id"]}
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "order_id": data.order_id,
        "user_id": user["id"],
        "amount": order["total"],
        "currency": "gbp",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, user=Depends(require_auth)):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction and order status
    if status.payment_status == "paid":
        transaction = await db.payment_transactions.find_one({"session_id": session_id})
        if transaction and transaction.get("payment_status") != "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"status": "completed", "payment_status": "paid"}}
            )
            await db.orders.update_one(
                {"id": transaction["order_id"]},
                {"$set": {"status": "paid"}}
            )
            # Clear cart
            await db.carts.delete_one({"user_id": user["id"]})
            
            # Send confirmation email (async)
            order = await db.orders.find_one({"id": transaction["order_id"]}, {"_id": 0})
            if order:
                asyncio.create_task(send_order_confirmation_email(order))
    
    return {"status": status.status, "payment_status": status.payment_status, "amount_total": status.amount_total}

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    stripe_api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url="")
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            transaction = await db.payment_transactions.find_one({"session_id": webhook_response.session_id})
            if transaction and transaction.get("payment_status") != "paid":
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {"$set": {"status": "completed", "payment_status": "paid"}}
                )
                await db.orders.update_one(
                    {"id": transaction["order_id"]},
                    {"$set": {"status": "paid"}}
                )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error"}

# ==================== EMAIL HELPER ====================

async def send_order_confirmation_email(order: dict):
    try:
        import resend
        
        resend_api_key = os.environ.get('RESEND_API_KEY')
        if not resend_api_key:
            logger.warning("RESEND_API_KEY not configured, skipping email")
            return
        
        resend.api_key = resend_api_key
        sender_email = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
        
        items_html = "".join([
            f"<tr><td>{item['product_name']}</td><td>{item['size']}</td><td>{item['quantity']}</td><td>£{item['price']:.2f}</td></tr>"
            for item in order["items"]
        ])
        
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #292524;">Thank you for your order!</h1>
            <p>Hi {order['shipping_address']['first_name']},</p>
            <p>Your order <strong>#{order['id'][:8].upper()}</strong> has been confirmed.</p>
            
            <h2>Order Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background: #f5f5f4;"><th>Product</th><th>Size</th><th>Qty</th><th>Price</th></tr>
                {items_html}
            </table>
            
            <p style="margin-top: 20px;"><strong>Subtotal:</strong> £{order['subtotal']:.2f}</p>
            <p><strong>Delivery:</strong> £{order['delivery']:.2f}</p>
            <p style="font-size: 18px;"><strong>Total:</strong> £{order['total']:.2f}</p>
            
            <h2>Delivery Address</h2>
            <p>{order['shipping_address']['first_name']} {order['shipping_address']['last_name']}<br>
            {order['shipping_address']['address_line1']}<br>
            {order['shipping_address'].get('address_line2', '')}<br>
            {order['shipping_address']['city']}, {order['shipping_address']['county']}<br>
            {order['shipping_address']['postcode']}</p>
            
            <p>We'll notify you when your order ships.</p>
            <p>Best regards,<br>Pascal Beds Team</p>
        </div>
        """
        
        params = {
            "from": sender_email,
            "to": [order["user_email"]],
            "subject": f"Order Confirmation #{order['id'][:8].upper()} - Pascal Beds",
            "html": html_content
        }
        
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Order confirmation email sent for order {order['id']}")
    except Exception as e:
        logger.error(f"Failed to send order confirmation email: {e}")

# ==================== NEWSLETTER ====================

@api_router.post("/newsletter")
async def subscribe_newsletter(data: NewsletterSubscribe):
    existing = await db.newsletter.find_one({"email": data.email})
    if existing:
        return {"message": "Already subscribed"}
    
    await db.newsletter.insert_one({
        "id": str(uuid.uuid4()),
        "email": data.email,
        "subscribed_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Successfully subscribed"}

# ==================== CONTACT ====================

@api_router.post("/contact")
async def submit_contact(data: ContactMessage):
    await db.contact_messages.insert_one({
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "subject": data.subject,
        "message": data.message,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    return {"message": "Message received, we'll get back to you soon"}

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_database():
    # Check if already seeded
    existing = await db.products.find_one()
    if existing:
        return {"message": "Database already seeded"}
    
    products = [
        # Divan Beds
        {
            "id": str(uuid.uuid4()), "name": "Luxury Divan Bed Set", "slug": "luxury-divan-bed-set",
            "description": "Experience ultimate comfort with our Luxury Divan Bed Set. Crafted with premium materials and featuring a sturdy base with optional storage drawers, this bed combines style with functionality. The plush headboard adds an elegant touch to any bedroom.",
            "short_description": "Premium divan bed with optional storage and luxury headboard",
            "category": "divan-beds", "price": 599.00, "sale_price": 449.00,
            "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800", "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "colors": ["Charcoal Grey", "Silver", "Mink", "Cream"],
            "storage_options": ["No Drawers", "2 Drawers", "4 Drawers", "Ottoman"],
            "features": ["Reinforced base construction", "Premium fabric upholstery", "Matching headboard included", "Easy assembly", "10-year frame guarantee"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.8, "review_count": 156
        },
        {
            "id": str(uuid.uuid4()), "name": "Memory Foam Divan Bed", "slug": "memory-foam-divan-bed",
            "description": "Our Memory Foam Divan Bed features a supportive mattress that moulds to your body for pressure relief and comfort. The robust divan base includes practical storage options.",
            "short_description": "Memory foam mattress with supportive divan base",
            "category": "divan-beds", "price": 499.00, "sale_price": None,
            "images": ["https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "colors": ["Grey", "Black", "White"],
            "storage_options": ["No Drawers", "2 Drawers", "4 Drawers"],
            "features": ["Memory foam comfort layer", "Pocket spring support", "Hypoallergenic materials", "Platform top base"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.6, "review_count": 89
        },
        # Bed Frames
        {
            "id": str(uuid.uuid4()), "name": "Modern Oak Bed Frame", "slug": "modern-oak-bed-frame",
            "description": "Stunning solid oak bed frame with clean contemporary lines. Features a slatted base for optimal mattress ventilation and a timeless design that complements any decor.",
            "short_description": "Solid oak frame with contemporary design",
            "category": "bed-frames", "price": 799.00, "sale_price": 649.00,
            "images": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800"],
            "sizes": ["Double", "King", "Super King"],
            "colors": ["Natural Oak", "Walnut", "White Oak"],
            "storage_options": [],
            "features": ["Solid oak construction", "Slatted base included", "15-year warranty", "Easy assembly with instructions", "Floor protectors included"],
            "delivery_time": "5-7 working days", "in_stock": True, "rating": 4.9, "review_count": 234
        },
        {
            "id": str(uuid.uuid4()), "name": "Velvet Upholstered Bed", "slug": "velvet-upholstered-bed",
            "description": "Make a statement with our luxurious velvet upholstered bed frame. Features a tall padded headboard and contemporary wing design.",
            "short_description": "Luxurious velvet bed with statement headboard",
            "category": "bed-frames", "price": 699.00, "sale_price": 549.00,
            "images": ["https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800"],
            "sizes": ["Double", "King", "Super King"],
            "colors": ["Emerald Green", "Navy Blue", "Blush Pink", "Grey"],
            "storage_options": [],
            "features": ["Premium velvet fabric", "Padded headboard", "Sprung slat base", "Stain-resistant treatment"],
            "delivery_time": "5-7 working days", "in_stock": True, "rating": 4.7, "review_count": 167
        },
        # Ottoman Beds
        {
            "id": str(uuid.uuid4()), "name": "Gas Lift Ottoman Bed", "slug": "gas-lift-ottoman-bed",
            "description": "Maximise your bedroom storage with our Gas Lift Ottoman Bed. Easy-lift mechanism reveals massive under-bed storage space. Perfect for smaller bedrooms.",
            "short_description": "Maximum storage with easy gas-lift mechanism",
            "category": "ottoman-beds", "price": 649.00, "sale_price": 499.00,
            "images": ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800"],
            "sizes": ["Small Double", "Double", "King", "Super King"],
            "colors": ["Grey Fabric", "Cream Fabric", "Black Leather"],
            "storage_options": ["End Opening", "Side Opening"],
            "features": ["Heavy-duty gas lifts", "Deep storage compartment", "Sturdy platform base", "Safety mechanism", "No assembly - delivered built"],
            "delivery_time": "5-7 working days", "in_stock": True, "rating": 4.8, "review_count": 298
        },
        {
            "id": str(uuid.uuid4()), "name": "Luxury Ottoman Storage Bed", "slug": "luxury-ottoman-storage-bed",
            "description": "Premium ottoman bed with velvet upholstery and generous storage. Features a curved headboard design for added elegance.",
            "short_description": "Premium velvet ottoman with curved headboard",
            "category": "ottoman-beds", "price": 849.00, "sale_price": None,
            "images": ["https://images.unsplash.com/photo-1615874694520-474822394e73?w=800"],
            "sizes": ["Double", "King", "Super King"],
            "colors": ["Silver Grey", "Charcoal", "Champagne"],
            "storage_options": ["End Opening"],
            "features": ["Velvet upholstery", "Curved headboard", "Premium gas lifts", "Solid base", "White glove delivery"],
            "delivery_time": "7-10 working days", "in_stock": True, "rating": 4.9, "review_count": 142
        },
        # Mattresses
        {
            "id": str(uuid.uuid4()), "name": "Premium Pocket Spring Mattress", "slug": "premium-pocket-spring-mattress",
            "description": "Our bestselling pocket spring mattress with 2000 individual springs for superior support. Features memory foam comfort layers and natural fillings for breathability.",
            "short_description": "2000 pocket springs with memory foam comfort",
            "category": "mattresses", "price": 549.00, "sale_price": 399.00,
            "images": ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "colors": [],
            "storage_options": [],
            "features": ["2000 pocket springs", "Memory foam layer", "Natural cotton cover", "Medium-firm feel", "Hypoallergenic", "10-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.7, "review_count": 567
        },
        {
            "id": str(uuid.uuid4()), "name": "Hybrid Orthopaedic Mattress", "slug": "hybrid-orthopaedic-mattress",
            "description": "Designed for those who need extra support. Combines pocket springs with high-density foam layers for optimal spinal alignment. Ideal for back pain sufferers.",
            "short_description": "Orthopaedic support with hybrid technology",
            "category": "mattresses", "price": 699.00, "sale_price": 549.00,
            "images": ["https://images.unsplash.com/photo-1576436866938-8f1c51b5bca5?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "colors": [],
            "storage_options": [],
            "features": ["3000 pocket springs", "Orthopaedic support", "Edge-to-edge support", "Temperature regulation", "Removable cover", "15-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.9, "review_count": 389
        }
    ]
    
    await db.products.insert_many(products)
    
    # Add some sample reviews
    reviews = [
        {"id": str(uuid.uuid4()), "product_id": products[0]["id"], "user_id": "sample", "user_name": "Sarah M.", "rating": 5, "title": "Absolutely love it!", "content": "Best bed we've ever had. Great quality and the delivery was super quick.", "created_at": datetime.now(timezone.utc).isoformat(), "verified_purchase": True},
        {"id": str(uuid.uuid4()), "product_id": products[0]["id"], "user_id": "sample", "user_name": "James T.", "rating": 4, "title": "Excellent quality", "content": "Very sturdy and comfortable. Assembly was easy with the included instructions.", "created_at": datetime.now(timezone.utc).isoformat(), "verified_purchase": True},
        {"id": str(uuid.uuid4()), "product_id": products[6]["id"], "user_id": "sample", "user_name": "Emma R.", "rating": 5, "title": "Life changing mattress", "content": "My back pain has completely gone since sleeping on this mattress. Worth every penny!", "created_at": datetime.now(timezone.utc).isoformat(), "verified_purchase": True},
    ]
    await db.reviews.insert_many(reviews)
    
    return {"message": "Database seeded successfully", "products_count": len(products)}

@api_router.get("/")
async def root():
    return {"message": "Pascal Beds API", "status": "running"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
