using UnityEngine;

public class Projectile : MonoBehaviour
{
    public float speed = 10f;
    public int damage = 1;
    public Color color = Color.yellow;
    
    private Rigidbody2D rb;

    private void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        
        // Slight randomization or angle logic if needed
        // Assuming rotation is set by instantiator
        
        GetComponent<SpriteRenderer>().color = color;
        Destroy(gameObject, 5f); // Safety destroy
    }

    private void FixedUpdate()
    {
        // Move forward locally
        rb.velocity = transform.right * speed;
    }

    // Collision handled by Target (Player/Enemy) via OnTriggerEnter2D
    // Or we can handle it here if we want centralized collision logic
    
    private void OnTriggerEnter2D(Collider2D other)
    {
        if (other.CompareTag("Wall"))
        {
            Destroy(gameObject);
        }
    }
}
