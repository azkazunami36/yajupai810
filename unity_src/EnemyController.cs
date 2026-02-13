using UnityEngine;

public class EnemyController : MonoBehaviour
{
    [Header("Stats")]
    public int health = 10;
    public int scoreValue = 100;
    public float speed = 2f;

    [Header("Combat")]
    public GameObject projectilePrefab;
    public Transform firePoint;
    public float fireRate = 2f;
    private float nextFireTime = 0f;

    [Header("Movement")]
    public Vector2 direction = Vector2.left;
    public bool isWavy = false;
    public float waveFrequency = 2f;
    public float waveAmplitude = 1f;

    private float lifetime = 0f;

    private void Update()
    {
        lifetime += Time.deltaTime;
        Move();
        
        if (projectilePrefab != null && Time.time >= nextFireTime)
        {
            Shoot();
            nextFireTime = Time.time + fireRate;
        }

        // Despawn if off-screen (left side)
        Vector3 viewPos = Camera.main.WorldToViewportPoint(transform.position);
        if (viewPos.x < -0.1f)
        {
            Destroy(gameObject);
        }
    }

    private void Move()
    {
        Vector3 moveDir = direction;

        if (isWavy)
        {
            moveDir.y = Mathf.Sin(lifetime * waveFrequency) * waveAmplitude;
        }

        transform.position += moveDir * speed * Time.deltaTime;
    }

    private void Shoot()
    {
        if (firePoint == null) return;
        Instantiate(projectilePrefab, firePoint.position, Quaternion.identity);
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("PlayerProjectile"))
        {
            TakeDamage(10); // Assume default damage
            Destroy(other.gameObject);
        }
        else if (other.CompareTag("Player"))
        {
            TakeDamage(100);
        }
    }

    public void TakeDamage(int amount)
    {
        health -= amount;
        if (health <= 0)
        {
            Die();
        }
    }

    private void Die()
    {
        GameManager.Instance.AddScore(scoreValue);
        // Instantiate Explosion Effect
        Destroy(gameObject);
    }
}
