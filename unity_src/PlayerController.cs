using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("Movement")]
    public float speed = 5f;
    public float boundaryPadding = 0.5f;

    [Header("Combat")]
    public GameObject projectilePrefab;
    public Transform firePoint;
    public float fireRate = 0.2f;
    private float nextFireTime = 0f;

    [Header("Stats")]
    public int maxHealth = 100; // Used for "lives" or HP representation if changed
    private bool isInvincible = false;

    [Header("Boss Mode")]
    public GameObject normalModel;
    public GameObject bossModel; // Assign a separate visual for boss mode
    public SpriteRenderer spriteRenderer;
    
    private Rigidbody2D rb;
    private Vector2 movement;

    private void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        if (spriteRenderer == null) spriteRenderer = GetComponent<SpriteRenderer>();
    }

    private void Update()
    {
        if (GameManager.Instance.isPaused || GameManager.Instance.isGameOver) return;

        // Input
        float moveX = Input.GetAxisRaw("Horizontal");
        float moveY = Input.GetAxisRaw("Vertical");
        movement = new Vector2(moveX, moveY).normalized;

        // Shooting
        if (Input.GetKey(KeyCode.Space) && Time.time >= nextFireTime)
        {
            Shoot();
            nextFireTime = Time.time + (GameManager.Instance.bossModeActive ? fireRate / 2 : fireRate);
        }

        // Bomb
        if ((Input.GetKeyDown(KeyCode.B) || Input.GetKeyDown(KeyCode.X)) && GameManager.Instance.bombs > 0)
        {
            UseBomb();
        }
        
        // Update Visuals based on Boss Mode
        UpdateAppearance();
    }

    private void FixedUpdate()
    {
        Move();
    }

    private void Move()
    {
        float currentSpeed = speed;
        if (GameManager.Instance.bossModeActive) currentSpeed *= 0.8f; // Slower in boss mode

        rb.velocity = movement * currentSpeed;

        // Clamp position within screen
        Vector3 pos = transform.position;
        Vector3 viewPos = Camera.main.WorldToViewportPoint(pos);
        viewPos.x = Mathf.Clamp(viewPos.x, 0.02f, 0.98f);
        viewPos.y = Mathf.Clamp(viewPos.y, 0.02f, 0.98f);
        transform.position = Camera.main.ViewportToWorldPoint(viewPos);
    }

    private void Shoot()
    {
        if (GameManager.Instance.bossModeActive)
        {
            // 5-way spread
            for (int i = 0; i < 5; i++)
            {
                float angle = -30f + (i * 15f);
                Quaternion rot = Quaternion.Euler(0, 0, angle);
                Instantiate(projectilePrefab, firePoint.position, rot);
            }
        }
        else
        {
            // Normal shot
            Instantiate(projectilePrefab, firePoint.position, Quaternion.identity);
        }
    }

    private void UseBomb()
    {
        GameManager.Instance.bombs--;
        // Instantiate Bomb Effect Prefab
        // Clear Enemies
        Debug.Log("Bomb Used!");
    }

    private void UpdateAppearance()
    {
        if (GameManager.Instance.bossModeActive)
        {
            if (bossModel != null) bossModel.SetActive(true);
            if (normalModel != null) normalModel.SetActive(false);
            if (spriteRenderer != null) spriteRenderer.color = Color.magenta;
            transform.localScale = Vector3.one * 1.5f;
        }
        else
        {
            if (bossModel != null) bossModel.SetActive(false);
            if (normalModel != null) normalModel.SetActive(true);
            if (spriteRenderer != null) spriteRenderer.color = Color.cyan; // Default color
            transform.localScale = Vector3.one;
        }
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        if (isInvincible) return;

        if (other.CompareTag("Enemy") || other.CompareTag("EnemyProjectile"))
        {
            TakeDamage();
            Destroy(other.gameObject); // Or damage implementation
        }
    }

    private void TakeDamage()
    {
        GameManager.Instance.lives--;
        if (GameManager.Instance.lives <= 0)
        {
            GameManager.Instance.GameOver();
            Destroy(gameObject);
        }
        else
        {
            // Invincibility frames logic
            Debug.Log("Player Hit! Lives: " + GameManager.Instance.lives);
        }
    }
}
