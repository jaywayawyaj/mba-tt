import random
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from products.models import Product, Departure
from products.seed_data.product_data import PRODUCT_DATA
from typing import List, Optional

class ProductFactory:
    @classmethod
    def generate_name(cls) -> str:
        return " ".join([
            random.choice(PRODUCT_DATA['subjects']),
            random.choice(PRODUCT_DATA['verbs']),
            random.choice(PRODUCT_DATA['objects']),
            random.choice(PRODUCT_DATA['adjectives']),
        ])

    @classmethod
    def get_location_data(cls) -> dict:
        return random.choice(PRODUCT_DATA['locations'])

    @classmethod
    def get_difficulty(cls) -> str:
        difficulties = PRODUCT_DATA['difficulties']
        return random.choices(
            [d['name'] for d in difficulties],
            weights=[d['weight'] for d in difficulties],
            k=1
        )[0]

    @classmethod
    def create_product(cls) -> Product:
        location_data = cls.get_location_data()

        return Product(
            name=cls.generate_name(),
            description=random.choice(PRODUCT_DATA['descriptions']),
            location=location_data['name'],
            difficulty=cls.get_difficulty(),
            duration=random.randint(
                location_data['typical_duration_range'][0],
                location_data['typical_duration_range'][1]
            ),
        )

    @classmethod
    def bulk_create(cls, count: int) -> List[Product]:
        products = [cls.create_product() for _ in range(count)]
        return Product.objects.bulk_create(products)

class DepartureFactory:
    @classmethod
    def generate_price(cls, location_data: dict) -> Decimal:
        min_price, max_price = location_data['typical_price_range']
        return Decimal(random.randint(min_price, max_price))

    @classmethod
    def generate_dates(cls, count: int) -> List[timezone.datetime]:
        """Generate a sorted list of unique future dates"""
        dates = set()
        start = timezone.now().date()
        while len(dates) < count:
            dates.add(start + timedelta(days=random.randint(30, 365)))
        return sorted(list(dates))

    @classmethod
    def create_departure(cls, product: Product, start_date: timezone.datetime, max_pax: int) -> Departure:
        location_data = next(
            loc for loc in PRODUCT_DATA['locations']
            if loc['name'] == product.location
        )

        return Departure(
            product=product,
            start_date=start_date,
            price=cls.generate_price(location_data),
            booked_pax=random.randint(0, max_pax),
            max_pax=max_pax,
        )

    @classmethod
    def bulk_create_for_product(cls, product: Product, count: Optional[int] = None) -> List[Departure]:
        if count is None:
            count = random.randint(3, 8)  # More realistic number of departures

        location_data = next(
            loc for loc in PRODUCT_DATA['locations']
            if loc['name'] == product.location
        )
        max_pax = random.randint(
            location_data['typical_group_size'][0],
            location_data['typical_group_size'][1]
        )

        dates = cls.generate_dates(count)
        departures = [
            cls.create_departure(product, date, max_pax)
            for date in dates
        ]
        return Departure.objects.bulk_create(departures)