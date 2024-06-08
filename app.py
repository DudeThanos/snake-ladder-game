from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Define the board with snakes and ladders
snakes = {16: 6, 47: 26, 49: 11, 56: 53, 62: 19,
          64: 60, 87: 24, 93: 73, 95: 75, 98: 78}
ladders = {2: 38, 4: 14, 9: 31, 21: 42,
           28: 84, 36: 44, 51: 67, 71: 91, 80: 100}


class Player:
    def __init__(self, name):
        self.name = name
        self.position = 1

    def move(self, steps):
        self.position += steps
        if self.position in snakes:
            self.position = snakes[self.position]
        elif self.position in ladders:
            self.position = ladders[self.position]
        if self.position > 100:
            self.position = 100


players = [Player("Player 1"), Player("Player 2")]
turn = 0


@app.route('/roll_dice', methods=['POST'])
def roll_dice():
    global turn
    dice_value = random.randint(1, 6)
    current_player = players[turn]
    current_player.move(dice_value)
    turn = 1 - turn  # Switch turns
    return jsonify({
        'dice_value': dice_value,
        'player_positions': [player.position for player in players],
        'current_turn': turn
    })


@app.route('/game_state', methods=['GET'])
def game_state():
    return jsonify({
        'player_positions': [player.position for player in players],
        'current_turn': turn
    })


@app.route('/restart_game', methods=['POST'])
def restart_game():
    global players, turn
    players = [Player("Player 1"), Player("Player 2")]
    turn = 0
    return jsonify({
        'player_positions': [player.position for player in players],
        'current_turn': turn
    })


if __name__ == '__main__':
    app.run(debug=True)
