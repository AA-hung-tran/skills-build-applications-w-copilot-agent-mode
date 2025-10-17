from django.core.management.base import BaseCommand
from octofit_tracker.models import Team, User, Activity, Workout, Leaderboard
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        Leaderboard.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users
        users = [
            User(name='Spider-Man', email='spiderman@marvel.com', team=marvel),
            User(name='Iron Man', email='ironman@marvel.com', team=marvel),
            User(name='Wonder Woman', email='wonderwoman@dc.com', team=dc),
            User(name='Batman', email='batman@dc.com', team=dc),
        ]
        for user in users:
            user.save()

        # Create activities
        Activity.objects.create(user=users[0], type='Running', duration=30, calories=300, date=timezone.now())
        Activity.objects.create(user=users[1], type='Cycling', duration=45, calories=400, date=timezone.now())
        Activity.objects.create(user=users[2], type='Swimming', duration=60, calories=500, date=timezone.now())
        Activity.objects.create(user=users[3], type='Yoga', duration=40, calories=200, date=timezone.now())

        # Create workouts
        w1 = Workout.objects.create(name='Hero HIIT', description='High intensity interval training for heroes.')
        w2 = Workout.objects.create(name='Power Yoga', description='Yoga for strength and flexibility.')
        w1.suggested_for.add(marvel)
        w2.suggested_for.add(dc)

        # Create leaderboard
        Leaderboard.objects.create(team=marvel, points=700)
        Leaderboard.objects.create(team=dc, points=600)

        self.stdout.write(self.style.SUCCESS('Database populated with superhero test data.'))
