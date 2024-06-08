# Running the Application

> Run the Flask Application:
> Open your terminal or command prompt and navigate to the directory where app.py is located.
> Run the Flask application:
> in terminal type - python app.py

> Open the Web Page:
> Open index.html in your web browser using live server.

Ensure your Flask server is running before opening the web page.

This setup provides a more interactive and graphical experience for this Snake and Ladder game.
The players' positions will be updated on the board as you roll the dice.

At the present the snakes & ladders images are only visible on single point so for reference
the connection of both snakes and ladders are shown on both the side of the board.

The game can be restarted using the restart button.

For dev's ->

For the Snake and Ladder game, the following APIs are available:

POST /roll_dice
Description: Rolls the dice and moves the current player's position according to the dice value. It also switches the turn to the next player.

Response:

dice_value (integer): The value of the dice roll (1 to 6).
player_positions (list of integers): The current positions of Player 1 and Player 2.
current_turn (integer): The index of the player whose turn is next (0 for Player 1, 1 for Player 2).
GET /game_state
Description: Retrieves the current state of the game.

Response:

player_positions (list of integers): The current positions of Player 1 and Player 2.
current_turn (integer): The index of the player whose turn is next (0 for Player 1, 1 for Player 2).
POST /restart_game
Description: Restarts the game by resetting the players' positions and the turn.

Response:

player_positions (list of integers): The reset positions of Player 1 and Player 2.
current_turn (integer): The index of the player whose turn is first (0 for Player 1). 2. List the Various Game Objects Involved
The game involves the following objects:

1. Player
   Attributes:

name (string): The name of the player.
position (integer): The current position of the player on the board.
Methods:

move(steps): Moves the player by the number of steps rolled on the dice. Handles snakes and ladders. 2. Board
Attributes:

snakes (dictionary): The mapping of start and end positions of snakes on the board.
ladders (dictionary): The mapping of start and end positions of ladders on the board. 3. Game
Attributes:

players (list of Player objects): The list of players in the game.
turn (integer): The index of the player whose turn it is.
Methods:

roll_dice(): Rolls the dice and moves the current player.
restart_game(): Resets the game to its initial state. 3. Measure and Report the Performance Numbers
To measure and report the performance numbers, you can use various profiling tools and techniques to analyze the backend and frontend performance. Here's a simple example using Flask's built-in logging for backend performance and browser developer tools for frontend performance.

# Backend Performance (Flask)

You can log the time taken for each API call using a decorator:

python code ( You can include this in app.py)

> import time
> from functools import wraps

> def timing_decorator(f):

    @wraps(f)
    def wrap(*args, **kwargs):
        start_time = time.time()
        result = f(*args, **kwargs)
        end_time = time.time()
        duration = end_time - start_time
        print(f'Function {f.__name__} took {duration:.4f} seconds')
        return result
    return wrap

> @app.route('/roll_dice', methods=['POST'])
> @timing_decorator
> def roll_dice():

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

> @app.route('/game_state', methods=['GET'])
> @timing_decorator
> def game_state():

    return jsonify({
        'player_positions': [player.position for player in players],
        'current_turn': turn
    })

> @app.route('/restart_game', methods=['POST'])
> @timing_decorator
> def restart_game():

    global players, turn
    players = [Player("Player 1"), Player("Player 2")]
    turn = 0
    return jsonify({
        'player_positions': [player.position for player in players],
        'current_turn': turn
    })

> Sample Output:
> Function roll_dice took 0.0001 seconds
> Function game_state took 0.0001 seconds
> Function restart_game took 0.0001 seconds

# Frontend Performance

Use the browser's developer tools to measure the performance of the frontend. Here's how you can do it:

Load Time: Measure the load time of the page.

Open the Developer Tools (F12).
Go to the "Network" tab.
Reload the page and observe the load times for each resource.
Script Execution Time: Measure the time taken by scripts to execute.

Open the Developer Tools (F12).
Go to the "Performance" tab.
Click "Record" and perform some actions on the page.
Stop the recording and analyze the time taken by different scripts.
FPS (Frames Per Second): Measure the FPS to ensure smooth animations.

Open the Developer Tools (F12).
Go to the "Performance" tab.
Click "Record" and perform some actions on the page.
Stop the recording and observe the FPS in the timeline.
Conclusion
With these methods, you can analyze and optimize the performance of your Snake and Ladder game both on the backend and frontend. This will help ensure a smooth and responsive user experience.
