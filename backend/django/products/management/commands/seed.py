from django.core.management.base import BaseCommand
from products.models import Product
from products.factories import ProductFactory, DepartureFactory

class Command(BaseCommand):
    help = "Populate the database with N products and their departures"

    def add_arguments(self, parser):
        parser.add_argument("N", type=str, help="Number of products to create")

    def handle(self, *args, **options):
        try:
            count = int(options["N"])
        except ValueError:
            self.stdout.write(self.style.ERROR("N must be an integer"))
            return

        Product.objects.all().delete()

        products = ProductFactory.bulk_create(count)

        # Create departures for each product
        departure_count = 0
        for product in products:
            departures = DepartureFactory.bulk_create_for_product(product)
            departure_count += len(departures)

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {len(products)} products and {departure_count} departures."
            )
        )
