import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [isHovered, setIsHovered] = useState(false); // Added for interactivity
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
            <label 
              style={{
                ...styles.uploadLabel, 
                backgroundColor: isHovered ? '#161b22' : '#000', // Subtly lightens on hover
                borderColor: isHovered ? '#3498db' : 'transparent' // Shows border on hover
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <input type="file" onChange={onFileChange} style={{ display: 'none' }} />
              <div style={styles.uploadIcon}>+</div>
              <div style={styles.uploadText}>Click to Upload Batik Image</div>
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
    flexDirection: window.innerWidth < 768 ? 'column' : 'row', 
    width: '100vw', 
    minHeight: '100vh', 
    backgroundColor: '#0b0e11', 
    color: '#fff', 
    fontFamily: 'Segoe UI, Arial',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    overflowX: 'hidden'
  },
  sidebar: { 
    width: window.innerWidth < 768 ? '100%' : '300px', 
    height: window.innerWidth < 768 ? '200px' : 'auto', 
    backgroundColor: '#161b22', 
    borderRight: window.innerWidth < 768 ? 'none' : '1px solid #30363d', 
    borderBottom: window.innerWidth < 768 ? '1px solid #30363d' : 'none',
    display: 'flex', 
    flexDirection: 'column' 
  },
  sidebarTitle: { padding: '15px 20px', fontSize: '1rem', borderBottom: '1px solid #30363d', margin: 0 },
  historyList: { 
    flex: 1, 
    padding: '10px', 
    overflowY: 'auto', 
    display: window.innerWidth < 768 ? 'flex' : 'block', 
    gap: '10px'
  },
  historyCard: { 
    display: 'flex', 
    gap: '10px', 
    alignItems: 'center', 
    backgroundColor: '#0d1117', 
    padding: '8px', 
    borderRadius: '8px', 
    marginBottom: window.innerWidth < 768 ? '0' : '12px',
    minWidth: window.innerWidth < 768 ? '180px' : 'auto',
    border: '1px solid #21262d' 
  },
  historyThumb: { width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' },
  miniGauge: { width: '30px', height: '3px', backgroundColor: '#333', borderRadius: '2px' },
  miniFill: { height: '100%', backgroundColor: '#27ae60', borderRadius: '2px' },
  systemStatus: { padding: '10px', borderTop: '1px solid #30363d', fontSize: '0.7rem', display: 'flex', gap: '8px', alignItems: 'center', color: '#27ae60' },
  statusDot: { width: '6px', height: '6px', backgroundColor: '#27ae60', borderRadius: '50%', boxShadow: '0 0 5px #27ae60' },
  
  mainContent: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    padding: window.innerWidth < 768 ? '20px' : '30px', 
    backgroundColor: '#0d1117'
  },
  mainTitle: { fontSize: window.innerWidth < 768 ? '1.5rem' : '2.2rem', letterSpacing: '2px', fontWeight: '300', marginTop: '10px' },
  visionFrame: { 
    width: '100%', 
    maxWidth: '800px', 
    height: window.innerWidth < 768 ? '250px' : '500px', 
    border: '1px solid #3498db', 
    borderRadius: '12px', 
    marginTop: '20px', 
    backgroundColor: '#000', 
    overflow: 'hidden', 
    position: 'relative'
  },
  uploadLabel: { 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', // Fix: Centering horizontally
    alignItems: 'center',     // Fix: Centering vertically
    cursor: 'pointer', 
    transition: 'all 0.3s ease',
    border: '2px dashed transparent'
  },
  uploadIcon: { fontSize: '4rem', color: '#3498db', marginBottom: '10px' },
  uploadText: { fontSize: '1.1rem', color: '#888', letterSpacing: '1px' },
  previewContainer: { width: '100%', height: '100%', position: 'relative' },
  activeImage: { width: '100%', height: '100%', objectFit: 'contain' },
  neuralOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent 60%, rgba(52,152,219,0.3) 100%)', pointerEvents: 'none', zIndex: '1' },
  scanStatusLine: { position: 'absolute', bottom: '0', width: '100%', padding: '8px 0', backgroundColor: 'rgba(0, 0, 0, 0.8)', textAlign: 'center', fontSize: '0.7rem', color: '#3498db', borderTop: '1px solid #3498db', zIndex: '2' },
  closeBtn: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', zIndex: 10 },
  scanBtn: { marginTop: '20px', width: window.innerWidth < 768 ? '90%' : 'auto', padding: '12px 60px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' },
  footerInfo: { marginTop: 'auto', padding: '20px' },
  engineBadge: { border: '1px solid #27ae60', color: '#27ae60', padding: '5px 15px', borderRadius: '20px', fontSize: '0.7rem' },
  
  resultPanel: { width: window.innerWidth < 768 ? '100%' : '380px', backgroundColor: '#161b22', borderLeft: window.innerWidth < 768 ? 'none' : '1px solid #30363d', borderTop: window.innerWidth < 768 ? '1px solid #30363d' : 'none', padding: '20px', display: 'flex', flexDirection: 'column' },
  panelHeader: { fontSize: '1.1rem', marginBottom: '20px', fontWeight: 'bold' },
  gaugeContainer: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  insightBox: { backgroundColor: '#0d1117', padding: '15px', borderRadius: '12px', border: '1px solid #30363d' },
  infoBits: { marginTop: '20px' },
  bit: { fontSize: '0.8rem', color: '#888', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }
};

export default App;