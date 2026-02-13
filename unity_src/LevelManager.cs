using UnityEngine;
using System.Collections;

public class LevelManager : MonoBehaviour
{
    [System.Serializable]
    public class Wave
    {
        public string waveName;
        public GameObject enemyPrefab;
        public int count;
        public float spawnInterval;
    }

    public Wave[] waves;
    public Transform[] spawnPoints;
    
    public GameObject bossPrefab;

    private int currentWaveIndex = 0;

    public void StartLevel()
    {
        StartCoroutine(RunLevel());
    }

    private IEnumerator RunLevel()
    {
        yield return new WaitForSeconds(2f); // Start delay

        foreach (Wave wave in waves)
        {
            // HUD Notification: Wave Start
            Debug.Log("Wave: " + wave.waveName);

            for (int i = 0; i < wave.count; i++)
            {
                if (GameManager.Instance.isGameOver) yield break;

                Transform sp = spawnPoints[Random.Range(0, spawnPoints.Length)];
                Instantiate(wave.enemyPrefab, sp.position, Quaternion.identity);
                
                yield return new WaitForSeconds(wave.spawnInterval);
            }

            yield return new WaitForSeconds(3f); // Wave clear delay
        }

        // Boss Battle
        Debug.Log("Warning! Boss Approaching!");
        yield return new WaitForSeconds(3f);
        
        if (bossPrefab != null)
        {
            Vector3 bossSpawnPos = new Vector3(10f, 0f, 0f); // Off-screen right
            Instantiate(bossPrefab, bossSpawnPos, Quaternion.identity);
        }
    }
}
