from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
from products.factories import ProductFactory, DepartureFactory
from products.models import Product, Departure
from products.seed_data.product_data import PRODUCT_DATA

class ProductFactoryTest(TestCase):
    def test_generate_name(self):
        """Test that generated names contain all required parts"""
        name = ProductFactory.generate_name()
        # Instead of checking exact word count, verify each component is present
        self.assertTrue(any(subject in name for subject in PRODUCT_DATA['subjects']))
        self.assertTrue(any(verb in name for verb in PRODUCT_DATA['verbs']))
        self.assertTrue(any(obj in name for obj in PRODUCT_DATA['objects']))
        self.assertTrue(any(adj in name for adj in PRODUCT_DATA['adjectives']))

    def test_get_location_data(self):
        """Test that location data is valid"""
        location_data = ProductFactory.get_location_data()
        self.assertIn(location_data, PRODUCT_DATA['locations'])
        self.assertIn('name', location_data)
        self.assertIn('typical_price_range', location_data)
        self.assertIn('typical_duration_range', location_data)
        self.assertIn('typical_group_size', location_data)

    def test_get_difficulty(self):
        """Test that difficulty is one of the valid options"""
        difficulty = ProductFactory.get_difficulty()
        valid_difficulties = [d['name'] for d in PRODUCT_DATA['difficulties']]
        self.assertIn(difficulty, valid_difficulties)

    def test_create_product(self):
        """Test that created product has all required fields"""
        product = ProductFactory.create_product()
        self.assertIsInstance(product, Product)
        self.assertTrue(product.name)
        self.assertTrue(product.description)
        self.assertIn(product.location, [loc['name'] for loc in PRODUCT_DATA['locations']])
        self.assertTrue(3 <= product.duration <= 14)

    def test_bulk_create(self):
        """Test bulk creation of products"""
        count = 3
        products = ProductFactory.bulk_create(count)
        self.assertEqual(len(products), count)
        self.assertEqual(Product.objects.count(), count)


class DepartureFactoryTest(TestCase):
    def setUp(self):
        self.product = ProductFactory.bulk_create(1)[0]
        self.location_data = next(
            loc for loc in PRODUCT_DATA['locations']
            if loc['name'] == self.product.location
        )

    def test_generate_price(self):
        """Test that generated price is within the expected range"""
        price = DepartureFactory.generate_price(self.location_data)
        min_price, max_price = self.location_data['typical_price_range']
        self.assertIsInstance(price, Decimal)
        self.assertTrue(min_price <= price <= max_price)

    def test_generate_dates(self):
        """Test that generated dates are valid and sorted"""
        count = 3
        dates = DepartureFactory.generate_dates(count)

        self.assertEqual(len(dates), count)
        self.assertEqual(len(set(dates)), count)  # All dates should be unique

        # Dates should be sorted
        self.assertEqual(dates, sorted(dates))

        # All dates should be in the future
        now = timezone.now().date()
        for date in dates:
            self.assertGreater(date, now)

    def test_create_departure(self):
        """Test that created departure has all required fields"""
        start_date = timezone.now().date() + timezone.timedelta(days=30)
        max_pax = 10

        departure = DepartureFactory.create_departure(
            self.product,
            start_date,
            max_pax
        )

        self.assertIsInstance(departure, Departure)
        self.assertEqual(departure.product, self.product)
        self.assertEqual(departure.start_date, start_date)
        self.assertTrue(departure.booked_pax <= departure.max_pax)
        self.assertEqual(departure.max_pax, max_pax)

    def test_bulk_create_for_product(self):
        """Test bulk creation of departures for a product"""
        count = 3
        departures = DepartureFactory.bulk_create_for_product(
            self.product,
            count=count
        )

        self.assertEqual(len(departures), count)
        self.assertEqual(
            Departure.objects.filter(product=self.product).count(),
            count
        )

    def test_bulk_create_for_product_with_default_count(self):
        """Test bulk creation with default random count"""
        departures = DepartureFactory.bulk_create_for_product(self.product)

        self.assertTrue(3 <= len(departures) <= 8)
        self.assertEqual(
            Departure.objects.filter(product=self.product).count(),
            len(departures)
        )

    def test_departure_constraints(self):
        """Test that created departures meet all business constraints"""
        departures = DepartureFactory.bulk_create_for_product(self.product)

        for departure in departures:
            # Price constraints
            min_price, max_price = self.location_data['typical_price_range']
            self.assertTrue(min_price <= departure.price <= max_price)

            # Group size constraints
            min_size, max_size = self.location_data['typical_group_size']
            self.assertTrue(min_size <= departure.max_pax <= max_size)
            self.assertTrue(0 <= departure.booked_pax <= departure.max_pax)

            # Date constraints
            self.assertGreater(departure.start_date, timezone.now().date())