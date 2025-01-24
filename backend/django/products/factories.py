import random
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone
from products.models import Product, Departure

class ProductFactory:
    subjects = [
        "The cat", "A traveler", "The engineer",
        "An artist", "The CEO", "A programmer",
    ]
    verbs = [
        "jumps over", "analyzes", "creates",
        "improves", "builds", "envisions",
    ]
    objects = [
        "a bridge", "the code", "a masterpiece",
        "a new startup", "the solution", "a challenge",
    ]
    adjectives = [
        "quickly", "efficiently", "creatively",
        "with precision", "with passion", "with curiosity",
    ]

    descriptions = [
        "Hike, bike and snorkel this unique archipelago and encounter its special wildlife, on an adventure immersed in the natural world",
        "Our top wish-listed long weekender – paddle, trek and sleep in scenery you can't afjord to miss",
        "Hike up five of Guatemala's volcanoes - dubbed 'The Ring of Fire' - ending up at spectacular Lake Atitlán",
    ]

    locations = [
        "Norway",
        "Galapagos Islands, Ecuador",
        "Guatemala",
    ]

    difficulties = ["Easy", "Moderate", "Challenging", "Tough"]

    @classmethod
    def generate_name(cls):
        return f"{random.choice(cls.subjects)} {random.choice(cls.verbs)} {random.choice(cls.objects)} {random.choice(cls.adjectives)}."

    @classmethod
    def create_product(cls):
        return Product(
            name=cls.generate_name(),
            description=random.choice(cls.descriptions),
            location=random.choice(cls.locations),
            difficulty=random.choice(cls.difficulties),
            duration=random.randint(3, 14),
        )

    @classmethod
    def bulk_create(cls, count):
        products = [cls.create_product() for _ in range(count)]
        return Product.objects.bulk_create(products)

class DepartureFactory:
    @classmethod
    def create_departure(cls, product, max_pax):
        return Departure(
            product=product,
            start_date=timezone.now().date() + timedelta(days=random.randint(1, 365)),
            price=Decimal(round(random.randint(250, 5000), 2)),
            booked_pax=random.randint(0, max_pax),
            max_pax=max_pax,
        )

    @classmethod
    def bulk_create_for_product(cls, product, count=None):
        if count is None:
            count = random.randint(0, 20)
        max_pax = random.randint(5, 20)
        departures = [cls.create_departure(product, max_pax) for _ in range(count)]
        return Departure.objects.bulk_create(departures)