from django.test import TestCase
from .game_logic import PigGame


class PigGameTest(TestCase):

    def setUp(self):
        self.game = PigGame()

    def test_roll_dice(self):
        self.game.roll_dice()
        self.assertTrue(self.game.current_score >=
                        1 and self.game.current_score <= 6)

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
