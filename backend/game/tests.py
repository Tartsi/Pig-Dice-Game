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

    def test_cpu_no_move_on_turn_0(self):
        self.assertEqual(self.game.cpu_move(), 'not CPU turn')

    def test_cpu_move_roll_one_less_than_71(self):
        # Set up the game state
        self.game.scores = [50, 50]
        self.game.current_turn = 1  # CPU is player 1

        # Mock roll_dice to control the dice roll
        self.game.roll_dice = lambda: 1
        self.assertEqual(self.game.cpu_move(), ('rolled 1 < 71', 1))

    def test_cpu_move_roll_one_more_than_71(self):
        self.game.scores = [72, 50]
        self.game.current_turn = 1

        self.game.roll_dice = lambda: 1
        self.assertEqual(self.game.cpu_move(), ('rolled 1 > 71', 1))

    def test_cpu_end_race(self):
        self.game.scores = [72, 50]
        self.game.current_turn = 1

        self.game.current_score = 50
        self.game.roll_dice = lambda: 2
        self.assertEqual(self.game.cpu_move(),
                         ('winning score reached, holding', 2))

    def test_cpu_keep_pace(self):
        self.game.scores = [52, 20]
        self.game.current_turn = 1

        self.game.current_score = 25
        self.game.roll_dice = lambda: 2
        self.assertEqual(self.game.cpu_move(),
                         ('target score reached, holding', 2))

    def test_cpu_roll_no_conditions_met(self):
        self.game.scores = [10, 10]
        self.game.current_turn = 1

        self.game.current_score = 2
        self.game.roll_dice = lambda: 2
        self.assertEqual(self.game.cpu_move(),
                         ('no specific conditions met', 2))

    def test_to_dict(self):
        self.game.scores = [10, 20]
        self.game.current_turn = 1
        self.game.current_score = 5
        game_dict = self.game.to_dict()
        self.assertEqual(game_dict['scores'], [10, 20])
        self.assertEqual(game_dict['current_turn'], 1)
        self.assertEqual(game_dict['current_score'], 5)
        self.assertEqual(game_dict['vs_cpu'], False)

    def test_from_dict(self):
        game_dict = {
            'scores': [10, 20],
            'current_turn': 1,
            'current_score': 5,
            'vs_cpu': False
        }
        game = PigGame.from_dict(game_dict)
        self.assertEqual(game.scores, [10, 20])
        self.assertEqual(game.current_turn, 1)
        self.assertEqual(game.current_score, 5)
        self.assertEqual(game.vs_cpu, False)
