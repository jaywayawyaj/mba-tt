from django.db import models

class DifficultyChoices(models.TextChoices):
    EASY = "Easy"
    MODERATE = "Moderate"
    CHALLENGING = "Challenging"
    TOUGH = "Tough"


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DifficultyChoices)
    location = models.CharField(max_length=100)
    duration = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Departure(models.Model):
    product = models.ForeignKey(Product, related_name='departures', on_delete=models.CASCADE)
    start_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    booked_pax = models.IntegerField()
    max_pax = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name}: {self.start_date}"

    @property
    def available_pax(self):
        return self.max_pax - self.booked_pax

