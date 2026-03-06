import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const startScan = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8080/predict', formData);
      const data = res.data;
      setResult(data);
      setHistory(prev => [{ 
        motif: data.motif, 
        confidence: data.confidence, 
        img: preview,
        id: Date.now() 
      }, ...prev]);
    } catch (err) {
      alert("AI Neural Engine Offline! Check Port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* 1. LEFT SIDEBAR: SCAN HISTORY */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Scan History</h2>
        <div style={styles.historyList}>
          {history.map(item => (
            <div key={item.id} style={styles.historyCard}>
              <img src={item.img} style={styles.historyThumb} alt="thumb" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem' }}>{item.motif}</div>
                <div style={{ fontSize: '0.7rem', color: '#27ae60' }}>{item.confidence.toFixed(2)}%</div>
              </div>
              <div style={styles.miniGauge}>
                <div style={{ ...styles.miniFill, width: `${item.confidence}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div style={styles.systemStatus}>
          <div style={styles.statusDot}></div>
          <span>SYSTEM: ACTIVE</span>
        </div>
      </div>

      {/* 2. CENTER PANEL: ACTIVE VISION */}
      <div style={styles.mainContent}>
        <h1 style={styles.mainTitle}>Batik Expert <span style={{ color: '#3498db' }}>Vision</span></h1>
        
        <div style={styles.visionFrame}>
          {!preview ? (
            <label style={styles.uploadLabel}>
              <input type="file" onChange={onFileChange} style={{ display: 'none' }} />
              <div style={styles.uploadIcon}>+</div>
              Click to Upload Batik Image
            </label>
          ) : (
            <div style={styles.previewContainer}>
              <img src={preview} style={styles.activeImage} alt="active-scan" />
              <div style={styles.neuralOverlay}></div>
              <div style={styles.scanStatusLine}>
                {loading ? "ANALYZING NEURAL PATTERNS..." : "NEURAL PATTERN ANALYSIS: SUCCESS"}
              </div>
              <button onClick={() => setPreview(null)} style={styles.closeBtn}>X</button>
            </div>
          )}
        </div>

        <button onClick={startScan} disabled={!file || loading} style={styles.scanBtn}>
           {loading ? "SCANNING..." : "START SCAN"}
        </button>

        <div style={styles.footerInfo}>
          <div style={styles.engineBadge}>NEURAL ENGINE: READY</div>
        </div>
      </div>

      {/* 3. RIGHT PANEL: RESULT & INSIGHTS */}
      <div style={styles.resultPanel}>
        <div style={styles.panelHeader}>RESULT: <span style={{ color: '#27ae60' }}>{result ? result.motif.toUpperCase() : "WAITING..."}</span></div>
        
        <div style={styles.gaugeContainer}>
          <svg width="200" height="200" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#222" strokeWidth="8" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#27ae60" strokeWidth="8" 
                    strokeDasharray={`${result ? result.confidence * 2.83 : 0}, 283`}
                    transform="rotate(-90 50 50)" style={{ transition: 'stroke-dasharray 1s ease' }} />
            <text x="50" y="50" textAnchor="middle" fill="white" fontSize="12" dy=".3em">
              {result ? `${result.confidence.toFixed(2)}%` : "0%"}
            </text>
            <text x="50" y="65" textAnchor="middle" fill="#888" fontSize="5">CONFIDENCE</text>
          </svg>
        </div>

        <div style={styles.insightBox}>
          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
            {result ? `Motif classification successful. The neural engine identified distinct ${result.motif} patterns with high structural similarity.` 
                    : "Upload an image to begin pattern recognition and structural analysis."}
          </p>
          <div style={styles.infoBits}>
            <div style={styles.bit}><span style={{ color: '#27ae60' }}>■</span> Pattern variations: info bits</div>
            <div style={styles.bit}><span style={{ color: '#f39c12' }}>■</span> Structural depth: info bits</div>
            <div style={styles.bit}><span style={{ color: '#e74c3c' }}>■</span> Regional origin: info bits</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    width: '100vw', 
    height: '100vh', 
    backgroundColor: '#0b0e11', 
    color: '#fff', 
    fontFamily: 'Segoe UI, Arial',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  sidebar: { 
    width: '300px', 
    minWidth: '300px',
    backgroundColor: '#161b22', 
    borderRight: '1px solid #30363d', 
    display: 'flex', 
    flexDirection: 'column' 
  },
  sidebarTitle: { padding: '20px', fontSize: '1.2rem', borderBottom: '1px solid #30363d', margin: 0 },
  historyList: { flex: 1, padding: '15px', overflowY: 'auto' },
  historyCard: { display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#0d1117', padding: '10px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #21262d' },
  historyThumb: { width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover' },
  miniGauge: { width: '40px', height: '4px', backgroundColor: '#333', borderRadius: '2px' },
  miniFill: { height: '100%', backgroundColor: '#27ae60', borderRadius: '2px' },
  systemStatus: { padding: '15px', borderTop: '1px solid #30363d', fontSize: '0.75rem', display: 'flex', gap: '8px', alignItems: 'center', color: '#27ae60' },
  statusDot: { width: '8px', height: '8px', backgroundColor: '#27ae60', borderRadius: '50%', boxShadow: '0 0 5px #27ae60' },
  mainContent: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    padding: '30px', 
    position: 'relative',
    backgroundColor: '#0d1117'
  },
  mainTitle: { fontSize: '2.2rem', letterSpacing: '2px', fontWeight: '300', marginTop: '10px' },
  visionFrame: { 
    width: '90%', 
    maxWidth: '800px', 
    height: '500px', 
    border: '1px solid #3498db', 
    borderRadius: '12px', 
    marginTop: '20px', 
    backgroundColor: '#000', 
    overflow: 'hidden', 
    position: 'relative',
    boxShadow: '0 0 20px rgba(52, 152, 219, 0.2)'
  },
  uploadLabel: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#555' },
  uploadIcon: { fontSize: '3rem', marginBottom: '10px' },
  previewContainer: { width: '100%', height: '100%', position: 'relative' },
  activeImage: { width: '100%', height: '100%', objectFit: 'cover' },
  neuralOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    background: 'linear-gradient(to bottom, transparent 60%, rgba(52,152,219,0.3) 100%)',
    pointerEvents: 'none',
    zIndex: '1'
  },
  scanStatusLine: { 
    position: 'absolute', 
    bottom: '0', 
    left: '0',
    width: '100%', 
    padding: '12px 0', 
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Improved visibility
    textAlign: 'center', 
    fontSize: '0.9rem', 
    color: '#3498db', 
    fontWeight: 'bold',
    letterSpacing: '1px',
    borderTop: '2px solid #3498db',
    zIndex: '2',
    textTransform: 'uppercase'
  },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', zIndex: 10 },
  scanBtn: { marginTop: '30px', padding: '15px 80px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 'bold' },
  footerInfo: { marginTop: 'auto', padding: '20px' },
  engineBadge: { border: '1px solid #27ae60', color: '#27ae60', padding: '5px 15px', borderRadius: '20px', fontSize: '0.7rem' },
  resultPanel: { 
    width: '380px', 
    minWidth: '380px',
    backgroundColor: '#161b22', 
    borderLeft: '1px solid #30363d', 
    padding: '30px',
    display: 'flex',
    flexDirection: 'column'
  },
  panelHeader: { fontSize: '1.2rem', marginBottom: '40px', fontWeight: 'bold' },
  gaugeContainer: { display: 'flex', justifyContent: 'center', marginBottom: '40px' },
  insightBox: { backgroundColor: '#0d1117', padding: '20px', borderRadius: '12px', border: '1px solid #30363d' },
  infoBits: { marginTop: '20px' },
  bit: { fontSize: '0.8rem', color: '#888', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }
};

export default App;