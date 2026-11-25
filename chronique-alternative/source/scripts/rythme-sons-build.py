# Fabrique les bruitages du jeu de rythme (assets/audio/rythme) depuis les sons d'origine listés dans SOURCES.md.
# Les originaux (aperçus HQ Freesound et pack OpenGameArt) se placent dans raw/ ; sortie dans out/.
# Bruitages non vocaux : CC0. Voix de Hylee : une seule comédienne, MagicalMysticVA (CC BY 4.0), traitement commun.
import subprocess,re,os,json,sys
R='raw/'; T=R+'towel/wet_towel_on_body/'; M=R+'mmva/'
CL=[]
def add(name,src,start=None,end=None,af='',fade=0.06,voice=False):
    CL.append((name,src,start,end,af,fade,voice))
skin='highpass=f=90,lowpass=f=4200,equalizer=f=220:t=q:w=1:g=4'
for i,n in enumerate(['02','04','06','13','25','29']): add(f'peau-{i+1}',T+f'wet_towel_on_body-{n}.flac',0,0.32,skin,0.08)
add('peau-7',R+'540752_3248005-hq.mp3',0.98,1.28,skin,0.08)
add('peau-8',R+'540752_3248005-hq.mp3',3.98,4.28,skin,0.08)
sq=R+'546086_11374968-hq.mp3'
for i,(a,b) in enumerate([(3.53,3.95),(7.25,7.65),(10.08,10.55),(15.97,16.40)]): add(f'humide-{i+1}',sq,a,b,'highpass=f=120,lowpass=f=5000',0.1)
# --- Voix unique (MagicalMysticVA) : découpes, du plus doux au plus intense dans chaque groupe.
V=lambda i: M+f'{i}.mp3'
VOICE={
 'souffle':[(721833,0.45,1.75),(721833,2.85,4.10),(721833,5.50,6.85),(721833,10.30,11.80),(719167,0.12,1.45)],
 'soupir':[(734125,0.40,2.70),(700284,1.95,3.30),(700284,5.55,8.50),(700284,9.00,10.30),(700286,2.40,3.75)],
 # gemit 1-6 : doux (paliers 1-2), 7-12 : intenses (paliers 3+)
 'gemit':[(700492,3.75,4.95),(700492,5.90,7.05),(700492,13.75,15.05),(700286,0.20,1.35),(698529,8.50,9.50),(698529,17.75,18.75),
          (738286,3.55,4.60),(738286,6.95,7.95),(738286,23.20,24.05),(724219,6.30,8.55),(700918,9.55,10.55),(700918,13.10,14.30)],
 'halete':[(713145,0.25,1.45),(713145,1.50,2.70),(713145,2.70,4.50),(738286,10.95,13.05),(738286,16.95,19.05),(738286,25.95,28.55)],
 'apogee':[(734421,0.30,4.25),(724219,10.05,16.35),(724219,26.45,30.15)],
}
# Traitement commun à toute la voix : passe-haut, léger creux dans le bas-médium, présence douce, même petite pièce (réverbération courte).
VCHAIN='highpass=f=130,lowpass=f=11000,equalizer=f=320:t=q:w=1.2:g=-2.5,equalizer=f=3200:t=q:w=1.5:g=1.5,aecho=0.85:0.55:28|47|71:0.13|0.09|0.06'
for g,lst in VOICE.items():
    for i,(sid,a,b) in enumerate(lst): add(f'{g}-{i+1}',V(sid),a,b,VCHAIN,0.18 if g!='apogee' else 0.6,True)
add('draps-1',R+'644490_8331855-hq.mp3',0,3.1,'highpass=f=150',0.4)
add('rate-1',R+'789096_16923931-hq.mp3',1.76,2.30,'lowpass=f=900',0.15)
add('rate-2',R+'789096_16923931-hq.mp3',5.02,5.50,'lowpass=f=900',0.15)
exec(open('build_phases.py').read()) if os.path.exists('build_phases.py') else None
only=set(sys.argv[1:])
meta={}
def vol(path,flt):
    e=subprocess.run(['ffmpeg','-i',path,'-af',flt,'-f','null','-'],capture_output=True,text=True).stderr
    return e
for name,src,a,b,af,fade,voice in CL:
    meta[name]=os.path.basename(src)
    if only and not any(name.startswith(o) for o in only): continue
    tr=[] if a is None else ['-ss',str(a),'-to',str(b)]
    dur=(b-a) if a is not None else 3
    chain=','.join(x for x in [af,f'afade=t=in:d={0.03 if voice else 0.005}',f'afade=t=out:st={max(0,dur-fade):.3f}:d={fade}'] if x)
    tmp=f'out/{name}.wav'
    subprocess.run(['ffmpeg','-y','-v','error',*tr,'-i',src,'-ac','1','-ar','44100','-af',chain,tmp],check=True)
    if voice:
        # Même niveau perçu pour toute la voix : RMS des passages actifs ramené à -20 dB, crête limitée à -1,5 dB.
        e=vol(tmp,'silenceremove=stop_periods=-1:stop_threshold=-45dB,volumedetect')
        mean=float(re.search(r'mean_volume: ([-0-9.]+)',e).group(1)); mx=float(re.search(r'max_volume: ([-0-9.]+)',e).group(1))
        gain=min(-20-mean,-1.5-mx+4)
        post=f'volume={gain:.2f}dB,alimiter=limit=0.84:attack=3:release=60'
    else:
        mx=float(re.search(r'max_volume: ([-0-9.]+)',vol(tmp,'volumedetect')).group(1)); post=f'volume={-1.5-mx}dB'
    subprocess.run(['ffmpeg','-y','-v','error','-i',tmp,'-af',post,'-c:a','libmp3lame','-b:a','80k',f'out/{name}.mp3'],check=True)
    os.remove(tmp)
json.dump(meta,open('out/sources.json','w'),indent=1)
print(len(CL))
