using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public static AudioManager Instance { get; private set; }

    [Header("Audio Sources")]
    public AudioSource bgmSource;
    public AudioSource seSource;

    [Header("Clips")]
    public AudioClip bgmMain;
    public AudioClip bgmBoss;
    public AudioClip seShoot;
    public AudioClip seExplosion;
    public AudioClip sePowerUp;

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

    public void PlayBGM(AudioClip clip)
    {
        if (bgmSource.clip == clip) return;
        bgmSource.clip = clip;
        bgmSource.Play();
    }

    public void PlaySE(AudioClip clip)
    {
        seSource.PlayOneShot(clip);
    }
    
    // Helper methods for specific sounds
    public void PlayShoot() { PlaySE(seShoot); }
    public void PlayExplosion() { PlaySE(seExplosion); }
}
