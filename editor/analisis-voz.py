import sys, numpy as np, wave
bands=[60,100,160,250,400,630,1000,1600,2500,4000,6300,10000,14000]
def load(p):
    w=wave.open(p); a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float64)/32768; return a,w.getframerate()
def analyze(p):
    a,sr=load(p); n=4096; hop=2048
    frames=np.lib.stride_tricks.sliding_window_view(a,n)[::hop]*np.hanning(n)
    rms=np.sqrt((frames**2).mean(1)); db=20*np.log10(rms+1e-9)
    act=db>np.percentile(db,40)  # tramos con voz
    spec=(np.abs(np.fft.rfft(frames[act],axis=1))**2).mean(0); fr=np.fft.rfftfreq(n,1/sr)
    out=[]
    for i in range(len(bands)-1):
        m=(fr>=bands[i])&(fr<bands[i+1]); out.append(10*np.log10(spec[m].mean()+1e-20))
    out=np.array(out); out-=out[6]  # normalizado a la banda 1–1.6k
    fast=20*np.log10(np.sqrt(np.convolve(a**2,np.ones(480)/480,'valid'))+1e-9)
    crest=20*np.log10(np.abs(a).max()/np.sqrt((a**2).mean()))
    noise=np.percentile(db,5); speech=np.percentile(db,90)
    return out,crest,speech-noise
print("bandas Hz:   "+" ".join(f"{b:>6}" for b in bands[:-1]))
for p in sys.argv[1:]:
    o,c,snr=analyze(p); print(f"{p:10s} "+" ".join(f"{x:6.1f}" for x in o)+f" | crest {c:4.1f} dB | voz-ruido {snr:4.1f} dB")
