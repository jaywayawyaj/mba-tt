from rest_framework import serializers
from .models import Product, Departure


class DepartureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departure
        fields = [
            "id",
            "start_date",
            "price",
            "booked_pax",
            "max_pax",
        ]

class ProductSerializer(serializers.ModelSerializer):
    departures = DepartureSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "difficulty",
            "duration",
            "departures",
        ]