import sys, json
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[1], device="cpu", compute_type="int8")
import numpy as np, wave; wf=wave.open(sys.argv[2]); a=np.frombuffer(wf.readframes(wf.getnframes()),np.int16).astype(np.float32)/32768
segs, info = m.transcribe(a, language="es", word_timestamps=True, beam_size=5)
out=[]
for s in segs:
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}")
    out.append({"start":s.start,"end":s.end,"text":s.text.strip(),"words":[{"w":w.word.strip(),"s":round(w.start,2),"e":round(w.end,2)} for w in s.words]})
json.dump(out, open(sys.argv[3],"w"), ensure_ascii=False, indent=1)
