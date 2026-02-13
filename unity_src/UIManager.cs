using UnityEngine;
using UnityEngine.UI; // For standard UI
using TMPro; // Standard in modern Unity

public class UIManager : MonoBehaviour
{
    [Header("HUD")]
    public TextMeshProUGUI scoreText;
    public TextMeshProUGUI livesText;
    public TextMeshProUGUI stageText;
    
    [Header("Screens")]
    public GameObject startScreen;
    public GameObject gameOverScreen;
    public GameObject pauseScreen;

    public void UpdateScore(int score)
    {
        if (scoreText) scoreText.text = "SCORE: " + score;
    }

    public void UpdateLives(int lives)
    {
        if (livesText) livesText.text = "LIVES: " + lives;
    }

    public void ShowGameOver()
    {
        if (gameOverScreen) gameOverScreen.SetActive(true);
    }

    public void TogglePause(bool isPaused)
    {
        if (pauseScreen) pauseScreen.SetActive(isPaused);
    }
}
