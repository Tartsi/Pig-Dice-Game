from random import randint


class PigGame():
    def __init__(self):
        """
        Initializes a new instance of the PigGame class.
        """
        self.scores = [0, 0]  # index-0 is player 1, index-1 is player 2
        self.current_turn = 0  # 0 always goes first
        self.current_score = 0

    def roll_dice(self):
        """
        Simulates rolling a dice and updates the current score accordingly.
        If a 1 is rolled, the current score is reset to 0 and the turn ends.
        """
        roll = randint(1, 6)

        if roll == 1:
            self.current_score = 0
            self.end_turn()
        else:
            self.current_score += roll

        return roll

    def hold(self):
        """
        Adds the current score to the player's total score and ends the current turn.
        """
        self.scores[self.current_turn] += self.current_score
        self.current_score = 0
        self.end_turn()

    def end_turn(self):
        """
        Ends the current turn and switches to the next player's turn.
        """
        self.current_turn = 1 - self.current_turn

    def restart(self):
        """
        Restarts the game by resetting the scores and current turn.
        """
        self.scores = [0, 0]
        self.current_turn = 0
        self.current_score = 0

    def cpu_move(self):
        """
        Perform the CPU's move in the game.

        If the scores of either player reach 71 or more,
        the CPU will roll the dice until it rolls a 1
        or its current score plus its total score is 100 or more.
        If neither player has reached 71 or more,
        the CPU will try to keep pace with the opponent's score.
        It will hold when its current score is equal to or greater
        than the target score,
        which is calculated as 21 plus the absolute difference between
        the scores of the two players divided by 8.
        """

        # Add returns with explanations to the end of each condition to make testing easier

        if self.current_turn == 0:
            return 'not CPU turn'

        if self.scores[0] >= 71 or self.scores[1] >= 71:
            # End race - roll to win

            roll = self.roll_dice()

            if roll == 1:
                return 'rolled 1 > 71', roll
            if self.current_score + self.scores[self.current_turn] >= 100:
                return 'winning score reached, holding', roll

        else:
            # Keep pace - holds on 21 plus the difference between scores divided by 8
            target_score = 21 + abs(self.scores[0] - self.scores[1]) // 8

            roll = self.roll_dice()

            if roll == 1:
                return 'rolled 1 < 71', roll

            if self.current_score >= target_score:
                return 'target score reached, holding', roll

        return 'no specific conditions met', roll

    def to_dict(self):
        """
        Converts the PigGame object to a dictionary representation.

        Returns:
            dict: A dictionary containing the scores, current turn, and current score.
        """
        return {
            'scores': self.scores,
            'current_turn': self.current_turn,
            'current_score': self.current_score
        }

    @classmethod
    def from_dict(cls, data):
        """
        Creates a new instance of the PigGame class from a dictionary representation.

        Args:
            data (dict): A dictionary containing the scores, current turn, and current score.

        Returns:
            PigGame: A new instance of the PigGame class.
        """
        game = cls()
        game.scores = data['scores']
        game.current_turn = data['current_turn']
        game.current_score = data['current_score']
        return game
