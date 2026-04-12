# ==================== UPDATED SEED DATA ====================
# Replace the products list inside seed_database() in server.py with this data
# This matches the real prices from BED-RETAIL-PRICE.pdf and MATTRESS-RETAIL-SALE_PRICE.pdf

import uuid
from datetime import datetime, timezone

def get_seed_products():
    return [
        # ── DIVAN BEDS (from BED-RETAIL-PRICE.pdf) ─────────────────────────
        {
            "id": str(uuid.uuid4()), "name": "Classic Divan Bed", "slug": "classic-divan-bed",
            "description": "Our classic divan bed base provides excellent support and comfort. A timeless design built to last, perfect for any bedroom. The sturdy construction ensures years of reliable use.",
            "short_description": "Classic divan base — solid, simple and reliable",
            "category": "divan-beds",
            "price": 329.00, "sale_price": 249.00,
            "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 199, "Small Double": 229, "Double": 249, "King": 329, "Super King": 399},
            "colors": ["Charcoal", "Silver", "Cream", "Mink"],
            "storage_options": ["No Storage"],
            "features": ["Solid divan base", "Choice of colours", "Headboard included", "Easy assembly", "2-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.7, "review_count": 212,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name": "2-Drawer Divan Bed", "slug": "2-drawer-divan-bed",
            "description": "Our 2-drawer divan bed combines a solid base with practical under-bed storage. Two large side drawers provide ample space for bedding, pillows, and essentials. Perfect for bedrooms needing extra storage.",
            "short_description": "Solid divan base with 2 handy side drawers",
            "category": "2-drawer-beds",
            "price": 419.00, "sale_price": 289.00,
            "images": ["https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 289, "Small Double": 319, "Double": 339, "King": 419, "Super King": 489},
            "colors": ["Charcoal", "Silver", "Cream", "Mink"],
            "storage_options": ["2 Side Drawers"],
            "features": ["2 large side drawers", "Smooth drawer runners", "Solid base", "Headboard included", "2-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.8, "review_count": 341,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name": "4-Drawer Divan Bed", "slug": "4-drawer-divan-bed",
            "description": "Maximise your bedroom storage with our 4-drawer divan bed. Four large drawers — two on each side — provide exceptional storage capacity without sacrificing style.",
            "short_description": "Maximum storage with 4 large side drawers",
            "category": "4-drawer-beds",
            "price": 509.00, "sale_price": 379.00,
            "images": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 379, "Small Double": 409, "Double": 429, "King": 509, "Super King": 579},
            "colors": ["Charcoal", "Silver", "Cream", "Mink"],
            "storage_options": ["4 Side Drawers"],
            "features": ["4 large side drawers", "Smooth drawer runners", "Solid divan base", "Headboard included", "2-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.9, "review_count": 289,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # ── OTTOMAN BEDS ──────────────────────────────────────────────────────
        {
            "id": str(uuid.uuid4()), "name": "Ottoman Storage Bed", "slug": "ottoman-storage-bed",
            "description": "Our gas-lift ottoman bed opens from the foot-end to reveal a massive storage compartment beneath the mattress. The hydraulic gas pistons make lifting effortless. Perfect for smaller bedrooms or anyone who needs serious storage.",
            "short_description": "Gas-lift ottoman with huge under-bed storage",
            "category": "ottoman-beds",
            "price": 599.00, "sale_price": 449.00,
            "images": ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
                       "https://images.unsplash.com/photo-1615874694520-474822394e73?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 399, "Small Double": 429, "Double": 449, "King": 529, "Super King": 599},
            "colors": ["Grey Fabric", "Cream Fabric", "Charcoal", "Black"],
            "storage_options": ["End Opening", "Side Opening"],
            "features": ["Hydraulic gas-lift mechanism", "Massive storage compartment", "Easy-lift operation", "Safety mechanism", "2-year warranty"],
            "delivery_time": "5-7 working days", "in_stock": True, "rating": 4.8, "review_count": 456,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # ── PRESTIGE BEDS ─────────────────────────────────────────────────────
        {
            "id": str(uuid.uuid4()), "name": "Prestige Luxury Bed", "slug": "prestige-luxury-bed",
            "description": "Our flagship Prestige bed represents the pinnacle of bedroom luxury. Featuring a stunning tall wingback headboard, premium fabric upholstery, and solid construction throughout. This is the bed you deserve.",
            "short_description": "Our flagship luxury bed with wingback headboard",
            "category": "prestige-beds",
            "price": 698.00, "sale_price": 498.00,
            "images": ["https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 498, "Small Double": 528, "Double": 548, "King": 628, "Super King": 698},
            "colors": ["Plush Velvet Grey", "Plush Velvet Navy", "Plush Velvet Mink", "Plush Velvet Cream"],
            "storage_options": ["No Storage", "Ottoman Storage"],
            "features": ["Tall wingback headboard", "Premium fabric upholstery", "Solid frame", "Sprung slat base", "2-year warranty"],
            "delivery_time": "5-7 working days", "in_stock": True, "rating": 4.9, "review_count": 178,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # ── TV BED ────────────────────────────────────────────────────────────
        {
            "id": str(uuid.uuid4()), "name": "Electric TV Bed", "slug": "electric-tv-bed",
            "description": "Experience the ultimate bedroom entertainment setup with our electric TV bed. Features a motorised TV lift at the foot of the bed — press a button and your TV rises up, press again and it disappears. Perfect for the modern bedroom.",
            "short_description": "Electric motorised TV lift bed — press a button",
            "category": "tv-beds",
            "price": 1399.00, "sale_price": 999.00,
            "images": ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800"],
            "sizes": ["Single", "King"],
            "size_prices": {"Single": 999, "King": 1399},
            "colors": ["Black Fabric", "Grey Fabric"],
            "storage_options": ["No Storage"],
            "features": ["Motorised TV lift mechanism", "Fits TVs up to 55\"", "Remote control included", "Silent motor", "USB charging ports", "2-year warranty"],
            "delivery_time": "7-10 working days", "in_stock": True, "rating": 4.7, "review_count": 93,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # ── KIDS BED ──────────────────────────────────────────────────────────
        {
            "id": str(uuid.uuid4()), "name": "Kids Divan Bed", "slug": "kids-divan-bed",
            "description": "A sturdy and safe single bed perfect for children. Low-profile design for easy access, with solid construction to withstand the energetic use kids put furniture through. Available in fun colours.",
            "short_description": "Safe and sturdy single bed for children",
            "category": "kids-beds",
            "price": 199.00, "sale_price": None,
            "images": ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
            "sizes": ["Single"],
            "size_prices": {"Single": 199},
            "colors": ["White", "Pink", "Blue", "Grey"],
            "storage_options": ["No Storage", "2 Drawers"],
            "features": ["Child-safe construction", "Low profile design", "Easy to clean fabric", "Solid frame", "2-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.8, "review_count": 124,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        # ── MATTRESSES (from MATTRESS-RETAIL-SALE_PRICE.pdf) ─────────────────
        {
            "id": str(uuid.uuid4()), "name": "Astral Essential Mattress", "slug": "astral-essential-mattress",
            "description": "The Astral is our entry-level essential mattress — great value without compromising on quality. Provides solid support and a comfortable sleep surface, ideal for guest rooms or those on a budget.",
            "short_description": "Essential comfort mattress — great value",
            "category": "mattresses-essential",
            "price": 249.00, "sale_price": 199.00,
            "images": ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King"],
            "size_prices": {"Single": 130, "Small Double": 179, "Double": 199, "King": 249},
            "colors": [], "storage_options": [],
            "features": ["Open coil spring system", "Quilted comfort layer", "Breathable fabric", "Medium firmness", "2-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.5, "review_count": 198,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name": "Ortho Memory Mattress", "slug": "ortho-memory-mattress",
            "description": "Our Ortho Memory combines orthopaedic support with a memory foam comfort layer. The firm orthopaedic base promotes correct spinal alignment while the memory foam moulds to your body for personalised comfort.",
            "short_description": "Orthopaedic support with memory foam comfort",
            "category": "mattresses-orthopaedic",
            "price": 349.00, "sale_price": 249.00,
            "images": ["https://images.unsplash.com/photo-1576436866938-8f1c51b5bca5?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 179, "Small Double": 229, "Double": 249, "King": 289, "Super King": 349},
            "colors": [], "storage_options": [],
            "features": ["Memory foam comfort layer", "Orthopaedic support base", "Pressure-relieving", "Ideal for back pain", "Hypoallergenic", "2-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.8, "review_count": 334,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name": "Orion 1000 Pocket Spring Mattress", "slug": "orion-1000-pocket-spring",
            "description": "1000 individual pocket springs each work independently to provide targeted support exactly where you need it. The Orion 1000 eliminates roll-together and gives both sleepers a customised sleep experience.",
            "short_description": "1000 pocket springs for personalised support",
            "category": "mattresses-pocket",
            "price": 429.00, "sale_price": 299.00,
            "images": ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 229, "Small Double": 279, "Double": 299, "King": 329, "Super King": 429},
            "colors": [], "storage_options": [],
            "features": ["1000 pocket springs", "Individual spring response", "No roll-together", "Breathable fillings", "Medium-firm feel", "2-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.7, "review_count": 287,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name": "Chicago 3000 Luxury Mattress", "slug": "chicago-3000-luxury",
            "description": "Our flagship Chicago 3000 features 3000 micro pocket springs topped with premium comfort layers including natural fillings. This is the ultimate luxury sleep experience — hotel quality in your own home.",
            "short_description": "3000 micro pocket springs — our finest mattress",
            "category": "mattresses-luxury",
            "price": 799.00, "sale_price": 629.00,
            "images": ["https://images.unsplash.com/photo-1576436866938-8f1c51b5bca5?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 499, "Small Double": 599, "Double": 629, "King": 699, "Super King": 799},
            "colors": [], "storage_options": [],
            "features": ["3000 micro pocket springs", "Natural cashmere fillings", "Hand-tufted", "Luxury knit border", "Dual-sided", "5-year warranty"],
            "delivery_time": "5-7 working days", "in_stock": True, "rating": 4.9, "review_count": 156,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()), "name": "Cool Cloud 2000 Mattress", "slug": "cool-cloud-2000",
            "description": "The Cool Cloud 2000 features 2000 pocket springs combined with a cooling gel-infused foam layer. Designed to regulate your body temperature throughout the night — ideal for those who sleep hot.",
            "short_description": "2000 pocket springs with cooling gel technology",
            "category": "mattresses-luxury",
            "price": 599.00, "sale_price": 479.00,
            "images": ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
            "sizes": ["Single", "Small Double", "Double", "King", "Super King"],
            "size_prices": {"Single": 329, "Small Double": 449, "Double": 479, "King": 529, "Super King": 599},
            "colors": [], "storage_options": [],
            "features": ["2000 pocket springs", "Cooling gel-infused foam", "Temperature regulation", "Breathable border", "Medium feel", "3-year warranty"],
            "delivery_time": "3-5 working days", "in_stock": True, "rating": 4.8, "review_count": 203,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
