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

        self.current_score += roll

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