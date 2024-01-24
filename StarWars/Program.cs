using System.Text;

namespace StarWars;

public sealed class Program
{
    static Queue<Screen> lineQueue = new Queue<Screen>();
    static AutoResetEvent queueNotifier = new AutoResetEvent(false);
    static bool isRunning;

    static void Main(string[] args)
    {
        var speedMultiplier = 1;
        if (args is not null && args.Length != 0)
        {
            var speedString = args[0].Replace("-", "");
            if (int.TryParse(speedString, out var speed))
                speedMultiplier = speed;
        }

        var lines = Data.StarWars.Split('\n');
        if (lines is null || lines.Length == 0)
            return;

        var starWarsThread = new Thread(() => LoadScreens(lines, speedMultiplier));
        starWarsThread.Start();
        starWarsThread.Join();
        Console.ReadKey();
    }

    static void LoadScreens(string[] lines, int speedMultiplier)
    {
        var printThread = new Thread(new ThreadStart(PrintScreens));
        printThread.Start();

        var sb = new StringBuilder();
        var index = 0;
        var timeDuration = 0;
        foreach (var line in lines)
        {
            if (index == 0)
            {
                timeDuration = int.Parse(line.Trim());
                index++;
                continue;
            }

            sb.AppendLine(line);
            if (index == 13)
            {
                lineQueue.Enqueue(new Screen { Text = sb.ToString(), Duration = timeDuration * 100 / speedMultiplier });
                if (lineQueue.Count >= 50)
                {
                    queueNotifier.Set();
                    Thread.Sleep(10);
                }
                sb.Clear();
                index = 0;
            }
            else
            {
                index++;
            }
        }

        isRunning = false;
        queueNotifier.Set();
        printThread.Join();
    }

    static void SetupConsole()
    {
        Console.CursorVisible = false;
        Console.ForegroundColor = ConsoleColor.DarkYellow;
        Console.BackgroundColor = ConsoleColor.Black;
        Console.WindowWidth = 67;
        Console.WindowHeight = 14;
        Console.Clear();
    }

    static void PrintScreens()
    {
        SetupConsole();
        isRunning = true;

        while (isRunning || lineQueue.Count != 0)
        {
            if (lineQueue.Count == 0)
            {
                queueNotifier.WaitOne();
                continue;
            }

            var screen = lineQueue.Dequeue();
            PrintScreen(screen);
        }
    }

    static void PrintScreen(Screen? screen)
    {
        if (screen is null)
            return;
        Console.Clear();
        Console.WriteLine(screen.Text);
        Thread.Sleep(screen.Duration);
    }
}
