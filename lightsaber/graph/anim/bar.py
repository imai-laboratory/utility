from builtins import input
import json
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
import subprocess
import argparse

class AnimatedBarGraph:
    def __init__(self, row, column, max_val=1.0):
        self.row = row
        self.column = column
        self.proc = subprocess.Popen(
            [
                'python', '-u', __file__,
                '--row', str(row),
                '--column', str(column),
                '--max', str(max_val)
            ],
            stdin=subprocess.PIPE)

    def update(self, values, hilights=[]):
        data = {
            'values': values,
            'hilights': hilights
        }
        self.proc.stdin.write(bytearray(json.dumps(data) + '\n', 'utf-8'))
        self.proc.stdin.flush()

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--row', type=int, default=1)
    parser.add_argument('--column', type=int, default=1)
    parser.add_argument('--max', type=float, default=1.0)
    args = parser.parse_args()

    # initialize graph space
    x = np.arange(args.column)
    y = np.zeros((args.column), dtype=np.float32)
    y += args.max
    fig, axs = plt.subplots(args.row, 1)
    bars = []
    for i in range(args.row):
        axs[i].set_title('index: ' + str(i))
        bars.append(axs[i].bar(x, y, label=str(i)))

    def draw(i):
        data = json.loads(input())
        values = data['values']
        hilights = data['hilights']
        for i in range(args.row):
            value = values[i]
            colors = ['b' for j in range(args.column)]
            for hilight in hilights:
                row = hilight[0]
                column = hilight[1]
                if i == row:
                    colors[column] = 'r'
            for bar, v, color in zip(bars[i], value, colors):
                bar.set_height(v)
                bar.set_color(color)

    ani = animation.FuncAnimation(fig, draw, interval=1)
    plt.show()
