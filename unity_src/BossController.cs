using UnityEngine;
using System.Collections;

public class BossController : MonoBehaviour
{
    public enum BossState { Intro, Idle, Attack1, Attack2, Attack3, Death }
    
    [Header("Stats")]
    public string bossName = "Unknown";
    public int maxHealth = 500;
    public int currentHealth;
    public int scoreValue = 5000;

    [Header("Movement")]
    public float speed = 1f;
    public float introTargetX = 3f; // Viewport or World X

    [Header("Combat")]
    public GameObject projectilePrefab;
    public Transform[] firePoints;

    private BossState currentState = BossState.Intro;
    private float stateTimer = 0f;

    private void Start()
    {
        currentHealth = maxHealth;
        StartCoroutine(BossBehaviorLoop());
    }

    private IEnumerator BossBehaviorLoop()
    {
        // Intro Phase
        while (transform.position.x > introTargetX)
        {
            transform.position += Vector3.left * speed * Time.deltaTime;
            yield return null;
        }

        currentState = BossState.Idle;

        // Main Loop
        while (currentHealth > 0)
        {
            yield return new WaitForSeconds(1f); // Idle delay

            // Decide Attack based on health/random
            int attackRnd = Random.Range(0, 3);
            switch (attackRnd)
            {
                case 0:
                    yield return StartCoroutine(AttackPatternSpread());
                    break;
                case 1:
                    yield return StartCoroutine(AttackPatternAimed());
                    break;
                case 2:
                    yield return StartCoroutine(AttackPatternSpin());
                    break;
            }
        }
    }

    private IEnumerator AttackPatternSpread()
    {
        // Fire 3 bursts of spread shots
        for (int k = 0; k < 3; k++)
        {
            for (int i = 0; i < 5; i++)
            {
                float angle = -30f + (i * 15f);
                Quaternion rot = Quaternion.Euler(0, 0, angle + 180); // Fire Left
                Instantiate(projectilePrefab, transform.position, rot);
            }
            yield return new WaitForSeconds(0.5f);
        }
    }

    private IEnumerator AttackPatternAimed()
    {
        // Fire aimed shots at player
        GameObject player = GameObject.FindGameObjectWithTag("Player");
        if (player != null)
        {
            for (int i = 0; i < 5; i++)
            {
                Vector3 dir = (player.transform.position - transform.position).normalized;
                float angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
                Quaternion rot = Quaternion.Euler(0, 0, angle);
                Instantiate(projectilePrefab, transform.position, rot);
                yield return new WaitForSeconds(0.2f);
            }
        }
    }
    
    private IEnumerator AttackPatternSpin()
    {
        // Spiral shot
        for (int i = 0; i < 20; i++)
        {
            float angle = i * 18f;
            Quaternion rot = Quaternion.Euler(0, 0, angle);
            Instantiate(projectilePrefab, transform.position, rot);
            yield return new WaitForSeconds(0.1f);
        }
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("PlayerProjectile"))
        {
            TakeDamage(10);
            Destroy(other.gameObject);
        }
        else if (other.CompareTag("Player"))
        {
            // Player takes collision damage
        }
    }

    public void TakeDamage(int amount)
    {
        currentHealth -= amount;
        // Flash Effect here
        
        if (currentHealth <= 0)
        {
            Die();
        }
    }

    private void Die()
    {
        StopAllCoroutines();
        currentState = BossState.Death;
        GameManager.Instance.AddScore(scoreValue);
        // Play huge explosion
        Debug.Log("Boss Defeated!");
        Destroy(gameObject, 0.5f); // Delay destroy for effect
        
        // Notify GameManager of Level Clear / Next Wave
    }
}
