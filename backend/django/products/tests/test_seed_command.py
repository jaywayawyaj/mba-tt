from io import StringIO
from django.test import TestCase
from django.core.management import call_command
from products.models import Product, Departure

class SeedCommandTest(TestCase):
    def setUp(self):
        self.out = StringIO()

    def test_seed_command_with_valid_input(self):
        args = ['5']
        call_command('seed', *args, stdout=self.out)

        products = Product.objects.all()
        self.assertEqual(products.count(), 5)

        for product in products:
            self.assertIsNotNone(product.name)
            self.assertIsNotNone(product.description)
            self.assertIn(product.location, [
                "Norway",
                "Galapagos Islands, Ecuador",
                "Guatemala",
            ])
            self.assertIn(product.difficulty, ["Easy", "Moderate", "Challenging", "Tough"])
            self.assertTrue(3 <= product.duration <= 14)

            departures = product.departures.all()
            if departures.exists():
                for departure in departures:
                    self.assertIsNotNone(departure.start_date)
                    self.assertIsNotNone(departure.price)
                    self.assertTrue(departure.booked_pax <= departure.max_pax)
                    self.assertTrue(5 <= departure.max_pax <= 20)
                    self.assertTrue(departure.price >= 250)
                    self.assertTrue(departure.price <= 5000)

    def test_seed_command_with_invalid_input(self):
        args = ['invalid']
        call_command('seed', *args, stdout=self.out)
        self.assertIn('N must be an integer', self.out.getvalue())

    def test_seed_command_clears_existing_data(self):
        call_command('seed', '3', stdout=self.out)
        initial_count = Product.objects.count()
        self.assertEqual(initial_count, 3)

        call_command('seed', '2', stdout=self.out)
        new_count = Product.objects.count()

        self.assertEqual(new_count, 2)