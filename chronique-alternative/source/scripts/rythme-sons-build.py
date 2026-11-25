# Fabrique les bruitages du jeu de rythme (assets/audio/rythme) depuis les sons CC0 d'origine listés dans SOURCES.md.
# Les originaux (aperçus HQ Freesound et pack OpenGameArt) se placent dans raw/ ; sortie dans out/.
import subprocess,re,os,json
R='raw/'; T=R+'towel/wet_towel_on_body/'
CL=[]
def add(name,src,start=None,end=None,af='',fade=0.06):
    CL.append((name,src,start,end,af,fade))
skin='highpass=f=90,lowpass=f=4200,equalizer=f=220:t=q:w=1:g=4'
for i,n in enumerate(['02','04','06','13','25','29']): add(f'peau-{i+1}',T+f'wet_towel_on_body-{n}.flac',0,0.32,skin,0.08)
add('peau-7',R+'540752_3248005-hq.mp3',0.98,1.28,skin,0.08)
add('peau-8',R+'540752_3248005-hq.mp3',3.98,4.28,skin,0.08)
sq=R+'546086_11374968-hq.mp3'
for i,(a,b) in enumerate([(3.53,3.95),(7.25,7.65),(10.08,10.55),(15.97,16.40)]): add(f'humide-{i+1}',sq,a,b,'highpass=f=120,lowpass=f=5000',0.1)
br=R+'534473_6652872-hq.mp3'
for i,(a,b) in enumerate([(0.30,1.15),(1.85,2.70),(3.38,4.25),(4.95,5.80)]): add(f'souffle-{i+1}',br,a,b,'highpass=f=100',0.15)
sd=[(R+'572062_11464399-hq.mp3',0.40,1.75),(R+'622560_11464399-hq.mp3',0.46,1.30),(R+'559668_11464399-hq.mp3',5.10,6.50),(R+'559668_11464399-hq.mp3',11.04,12.68)]
for i,(s,a,b) in enumerate(sd): add(f'soupir-{i+1}',s,a,b,'highpass=f=100',0.2)
vi=R+'384214_6528566-hq.mp3'; el=R+'459126_7048224-hq.mp3'
gm=[(vi,0.60,2.30),(vi,4.47,6.37),(vi,7.43,8.30),(vi,8.91,9.98),(vi,10.71,11.85),(el,0.0,1.56),(el,2.88,4.40)]
for i,(s,a,b) in enumerate(gm): add(f'gemit-{i+1}',s,a,b,'highpass=f=100',0.2)
pa=R+'534474_6652872-hq.mp3'
for i,(a,b) in enumerate([(0.67,1.40),(2.42,3.42),(5.28,6.50),(7.16,8.37),(9.79,10.77)]): add(f'halete-{i+1}',pa,a,b,'highpass=f=100',0.15)
add('apogee-1',el,5.68,10.47,'highpass=f=90',0.6)
add('apogee-2',R+'222651_4138330-hq.mp3',0,2.95,'highpass=f=90',0.5)
add('draps-1',R+'644490_8331855-hq.mp3',0,3.1,'highpass=f=150',0.4)
add('rate-1',R+'789096_16923931-hq.mp3',1.76,2.30,'lowpass=f=900',0.15)
add('rate-2',R+'789096_16923931-hq.mp3',5.02,5.50,'lowpass=f=900',0.15)
meta={}
for name,src,a,b,af,fade in CL:
    tr=[] if a is None else ['-ss',str(a),'-to',str(b)]
    dur=(b-a) if a is not None else 3
    chain=','.join(x for x in [af,f'afade=t=in:d=0.005',f'afade=t=out:st={max(0,dur-fade):.3f}:d={fade}'] if x)
    tmp=f'out/{name}.wav'
    subprocess.run(['ffmpeg','-y','-v','error',*tr,'-i',src,'-ac','1','-ar','44100','-af',chain,tmp],check=True)
    mx=float(re.search(r'max_volume: ([-0-9.]+)',subprocess.run(['ffmpeg','-i',tmp,'-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr).group(1))
    subprocess.run(['ffmpeg','-y','-v','error','-i',tmp,'-af',f'volume={-1.5-mx}dB','-c:a','libmp3lame','-b:a','80k',f'out/{name}.mp3'],check=True)
    os.remove(tmp); meta[name]=os.path.basename(src)
json.dump(meta,open('out/sources.json','w'),indent=1)
print(len(CL))
