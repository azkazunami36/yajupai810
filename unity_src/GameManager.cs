using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("Game Settings")]
    public int score;
    public int lives = 3;
    public int maxPlayerLives = 3; // Added for Boss Mode / Health Bar compatibility
    public int bombs = 3;
    public Difficulty difficulty = Difficulty.Normal;
    
    public bool isGameActive = false;
    public bool isGameOver = false;
    public bool isPaused = false;

    // Boss Mode Secret Code
    public bool bossModeActive = false;
    private string secretCodeBuffer = "";

    [Header("UI References")]
    // References to UI Managers or Text elements would go here
    [SerializeField] private GameObject uiPanel; 

    public enum Difficulty
    {
        Easy,
        Normal,
        Hard,
        Hell
    }

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape) || Input.GetKeyDown(KeyCode.P))
        {
            TogglePause();
        }

        if (isGameOver && Input.GetKeyDown(KeyCode.R))
        {
            RestartGame();
        }

        // Secret Code Detection
        if (Input.anyKeyDown)
        {
            string input = Input.inputString.ToUpper();
            if (!string.IsNullOrEmpty(input))
            {
                secretCodeBuffer += input;
                if (secretCodeBuffer.Length > 10) secretCodeBuffer = secretCodeBuffer.Substring(secretCodeBuffer.Length - 10);
                
                if (secretCodeBuffer.EndsWith("BOSS"))
                {
                    ToggleBossMode();
                    secretCodeBuffer = ""; // Reset buffer
                }
            }
        }
    }

    public void StartGame()
    {
        isGameActive = true;
        isGameOver = false;
        score = 0;
        lives = 3;
        bombs = 3;
        Time.timeScale = 1;
        // Load Game Scene
        SceneManager.LoadScene("GameScene");
    }

    public void TogglePause()
    {
        isPaused = !isPaused;
        Time.timeScale = isPaused ? 0 : 1;
        // Show/Hide Pause Menu
    }

    public void GameOver()
    {
        isGameOver = true;
        isGameActive = false;
        Time.timeScale = 0;
        // Show Game Over Screen
    }

    public void RestartGame()
    {
        StartGame();
    }

    public void AddScore(int amount)
    {
        score += amount;
        // Update UI
    }

    public void ToggleBossMode()
    {
        bossModeActive = !bossModeActive;
        Debug.Log("Boss Mode: " + (bossModeActive ? "ON" : "OFF"));
        // Play Sound
        // Show Notification
    }
}
