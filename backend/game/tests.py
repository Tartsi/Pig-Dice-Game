from django.test import TestCase
from .game_logic import PigGame


class PigGameTest(TestCase):

    def setUp(self):
        self.game = PigGame()

    def test_dice_roll(self):
        roll = self.game.roll_dice()

        if roll == 1:
            self.assertEqual(self.game.current_score, 0)
        else:
            self.assertEqual(self.game.current_score, roll)

        self.assertTrue(1 <= roll and roll <= 6)

    def test_hold(self):
        self.game.current_score = 5
        self.game.hold()
        self.assertEqual(self.game.scores[self.game.current_turn-1], 5)

    def test_hold_reset_current_score(self):
        self.game_current_score = 5
        self.game.hold()
        self.assertEqual(self.game.current_score, 0)

    def test_hold_keep_total_score(self):
        self.game.current_score = 5
        self.game.hold()
        self.game.current_score = 30
        self.game.hold()
        self.game.current_score = 20
        self.game.hold()
        self.assertEqual(self.game.scores[self.game.current_turn-1], 25)

    def test_end_turn(self):
        self.game.current_turn = 0
        self.game.end_turn()
        self.assertEqual(self.game.current_turn, 1)
        self.game.end_turn()
        self.assertEqual(self.game.current_turn, 0)

    def test_restart(self):
        self.game.scores = [10, 20]
        self.game.current_turn = 1
        self.game.current_score = 5
        self.game.restart()
        self.assertEqual(self.game.scores, [0, 0])
        self.assertEqual(self.game.current_turn, 0)
        self.assertEqual(self.game.current_score, 0)

    def test_cpu_move_roll_one(self):
        # Set up the game state
        self.game.scores = [50, 50]
        self.game.current_turn = 1  # CPU is player 1
        self.game.current_score = 0

        # Mock roll_dice to control the dice roll
        self.game.roll_dice = lambda: 1

        self.game.cpu_move()

        # Check if CPU stopped on rolling 1
        self.assertEqual(self.game.current_score, 0)

    def test_to_dict(self):
        self.game.scores = [10, 20]
        self.game.current_turn = 1
        self.game.current_score = 5
        game_dict = self.game.to_dict()
        self.assertEqual(game_dict['scores'], [10, 20])
        self.assertEqual(game_dict['current_turn'], 1)
        self.assertEqual(game_dict['current_score'], 5)

    def test_from_dict(self):
        game_dict = {
            'scores': [10, 20],
            'current_turn': 1,
            'current_score': 5
        }
        game = PigGame.from_dict(game_dict)
        self.assertEqual(game.scores, [10, 20])
        self.assertEqual(game.current_turn, 1)
        self.assertEqual(game.current_score, 5)
