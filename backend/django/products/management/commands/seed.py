from django.core.management.base import BaseCommand, CommandError
from products.models import Product, Departure
from products.factories import ProductFactory, DepartureFactory
from typing import Any, Optional

class Command(BaseCommand):
    help = "Populate the database with sample products and their departures"

    def add_arguments(self, parser):
        parser.add_argument(
            "count",
            type=str,
            help="Number of products to create"
        )
        parser.add_argument(
            '--keep-existing',
            action='store_true',
            help="Don't delete existing products before seeding"
        )

    def handle(self, *args: Any, count: str, keep_existing: bool = False, **options: Any) -> Optional[str]:
        try:
            product_count = int(count)
        except ValueError:
            self.stdout.write(self.style.ERROR("N must be an integer"))
            return

        if not keep_existing:
            self.stdout.write("Clearing existing products...")
            Product.objects.all().delete()

        self.stdout.write("Creating products...")
        products = ProductFactory.bulk_create(product_count)

        self.stdout.write("Creating departures...")
        departure_count = 0
        for product in products:
            departures = DepartureFactory.bulk_create_for_product(product)
            departure_count += len(departures)

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {len(products)} products and {departure_count} departures"
            )
        )
