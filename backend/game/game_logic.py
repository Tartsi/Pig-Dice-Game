from random import randint


class PigGame():
    def __init__(self):
        self.scores = [0, 0]  # index-0 is player 1, index-1 is player 2
        self.current_turn = 0  # 0 or 1, 0 always goes first
        self.current_score = 0

    def roll_dice(self):

        roll = randint(1, 6)

        if roll == 1:
            self.current_score = 0
            self.end_turn()

        self.current_score += roll

    def hold(self):
        self.scores[self.current_turn] += self.current_score
        self.current_score = 0
        self.end_turn()

    def end_turn(self):
        # 'Toggles' between 0 and 1 dynamically
        self.current_turn = 1 - self.current_turn
