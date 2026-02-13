// ===================== TRANSLATIONS =====================
const TRANSLATIONS = {
    en: {
        subtitle: "CYBERPUNK SHOOTER",
        btnStart: "START MISSION",
        btnSettings: "SETTINGS",
        btnEncyclopedia: "ENCYCLOPEDIA",
        btnOk: "LAUNCH",
        labelDiff: "THREAT LEVEL",
        diffEasy: "EASY",
        diffNormal: "NORMAL",
        diffHard: "HARD",
        diffHell: "HELL",
        controlsHint: "WASD: MOVE | SPACE: SHOOT | B: BOMB",
        settingsTitle: "SYSTEM CONFIGURATION",
        encyclopediaTitle: "ENEMY DATABASE",
        groupGeneral: "GENERAL",
        optLanguage: "LANGUAGE",
        groupVisuals: "VISUALS",
        optCrt: "CRT EFFECT",
        optParticles: "PARTICLES",
        valLow: "LOW",
        valMed: "MEDIUM",
        valHigh: "HIGH",
        groupAudio: "AUDIO (Simulated)",
        optBgm: "BGM VOLUME",
        optSe: "SE VOLUME",
        btnBack: "RETURN",
        gameOver: "GAME OVER",
        pressRestart: "Press R to Restart",
        paused: "PAUSED",
        pressResume: "Press P or ESC to resume",
        returnTitle: "🏠 RETURN TO TITLE (T)",

        // Dynamic
        score: "SCORE: ",
        weapon: "WEAPON: ",
        rate: "RATE: ",
        lives: "LIVES: ",
        bomb: "BOMB: ",
        stage: "STAGE ",
        funnel: "FUNNEL: ",
        bossBattle: "⚠ BOSS BATTLE ⚠",
        stagePrefix: "★ STAGE ",
        stageSuffix: " ★",
        wave: "WAVE ",
        clear: " CLEAR",
        scoreFinal: "Score: ",
        stageFinal: " | Stage: ",
        diffHellLabel: "HELL",
        bossLabel: "BOSS",

        name_Enemy: "PATROL DRONE",
        desc_Enemy: "Standard patrol unit. Moves in a straight line.",
        name_SineWaveEnemy: "SCOUT",
        desc_SineWaveEnemy: "Scout unit. Moves in a sine wave pattern to evade fire.",
        name_TrackingEnemy: "HUNTER",
        desc_TrackingEnemy: "Hunter unit. Adjusts altitude to track the player.",
        name_ZigZagEnemy: "INTERCEPTOR",
        desc_ZigZagEnemy: "Agile unit. Moves in a sharp zigzag pattern.",
        name_FormationEnemy: "SQUADRON",
        desc_FormationEnemy: "Formation unit. Attacks in coordinated groups.",
        name_BurstEnemy: "ARTILLERY",
        desc_BurstEnemy: "Heavy unit. Fires aimed bursts at the player.",
        name_KamikazeEnemy: "KAMIKAZE",
        desc_KamikazeEnemy: "Suicide drone. Locks on and charges at high speed.",
        name_WallEnemy: "BLOCKADE",
        desc_WallEnemy: "Heavy armor. Moves slowly and absorbs damage.",
        name_ShieldEnemy: "GUARDIAN",
        desc_ShieldEnemy: "Defensive unit. Protected by a rotating energy shield.",
        name_SpiralEnemy: "SPINNER",
        desc_SpiralEnemy: "Omni-directional unit. Fires projectiles in a spiral pattern.",
        name_MirageEnemy: "MIRAGE",
        desc_MirageEnemy: "Phantom unit. Phases in and out of visibility to avoid damage.",
        name_BomberEnemy: "BOMBER",
        desc_BomberEnemy: "Ordnance unit. Drops slow-moving mines while bobbing vertically.",
        name_SniperEnemy: "SNIPER",
        desc_SniperEnemy: "Marksman unit. Stops to aim a laser sight, then fires a high-speed shot.",
        name_PulsarEnemy: "PULSAR",
        desc_PulsarEnemy: "Radial unit. Periodically emits ring-shaped shockwaves.",
        name_CloakerEnemy: "CLOAKER",
        desc_CloakerEnemy: "Stealth unit. Nearly invisible until close range, then ambushes.",
        name_MiniCarrierEnemy: "MINI CARRIER",
        desc_MiniCarrierEnemy: "Carrier unit. Releases two mini drones upon destruction.",
        name_Boss: "DOOMSDAY",
        desc_Boss: "Level Guardian. Extremely heavily armed and dangerous.",
        name_SpeedBoss: "INTERCEPTOR ALPHA",
        desc_SpeedBoss: "High-mobility command unit. Uses speed and rapid fire to overwhelm.",
        name_FortressBoss: "FORTRESS",
        desc_FortressBoss: "Massive armored fortress. Deploys overwhelming firepower from multiple turrets.",
        name_PhantomBoss: "PHANTOM",
        desc_PhantomBoss: "Spectral entity. Teleports unpredictably and strikes from phantom positions.",
        name_StormBoss: "STORM LORD",
        desc_StormBoss: "Force of nature. Engulfs the battlefield with spiral barrages and lightning.",
        name_HydraBoss: "HYDRA",
        desc_HydraBoss: "Multi-headed destroyer. Three heads fire independently for relentless assault.",
        name_NemesisBoss: "NEMESIS",
        desc_NemesisBoss: "Ultimate nemesis. Enters a rage mode at 50% HP with devastating attacks."
    },
    ja: {
        subtitle: "サイバーパンク・シューター",
        btnStart: "ミッション開始",
        btnSettings: "設定",
        btnEncyclopedia: "敵図鑑",
        btnOk: "発進",
        labelDiff: "脅威レベル",
        diffEasy: "イージー",
        diffNormal: "ノーマル",
        diffHard: "ハード",
        diffHell: "地獄",
        controlsHint: "WASD: 移動 | SPACE: 射撃 | B: ボム",
        settingsTitle: "システム設定",
        encyclopediaTitle: "敵データベース",
        groupGeneral: "全般",
        optLanguage: "言語",
        groupVisuals: "映像",
        optCrt: "CRTエフェクト",
        optParticles: "パーティクル",
        valLow: "低",
        valMed: "中",
        valHigh: "高",
        groupAudio: "音声 (シミュレーション)",
        optBgm: "BGM音量",
        optSe: "SE音量",
        btnBack: "戻る",
        gameOver: "ゲームオーバー",
        pressRestart: "Rキーでリスタート",
        paused: "一時停止",
        pressResume: "P または ESC で再開",
        returnTitle: "🏠 タイトルへ戻る (T)",

        // Dynamic
        score: "スコア: ",
        weapon: "武器: ",
        rate: "レート: ",
        lives: "残機: ",
        bomb: "ボム: ",
        stage: "ステージ ",
        funnel: "ファンネル: ",
        bossBattle: "⚠ ボス戦 ⚠",
        stagePrefix: "★ ステージ ",
        stageSuffix: " ★",
        wave: "ウェーブ ",
        clear: " クリア",
        scoreFinal: "スコア: ",
        stageFinal: " | ステージ: ",
        stageFinal: " | ステージ: ",
        diffHellLabel: "地獄",
        bossLabel: "BOSS",

        name_Enemy: "パトロール機",
        desc_Enemy: "標準的な警邏ドローン。直線的に移動する。",
        name_SineWaveEnemy: "スカウト",
        desc_SineWaveEnemy: "偵察機。攻撃を回避するためサイン波を描いて移動する。",
        name_TrackingEnemy: "ハンター",
        desc_TrackingEnemy: "追跡機。プレイヤーの高度に合わせて移動する。",
        name_ZigZagEnemy: "インターセプター",
        desc_ZigZagEnemy: "迎撃機。鋭いジグザグ軌道で接近する。",
        name_FormationEnemy: "編隊機",
        desc_FormationEnemy: "戦術機。連携して編隊を組んで攻撃する。",
        name_BurstEnemy: "砲撃機",
        desc_BurstEnemy: "重装甲機。プレイヤーを狙って弾幕を放つ。",
        name_KamikazeEnemy: "特攻機",
        desc_KamikazeEnemy: "自爆ドローン。ロックオンして高速で突撃する。",
        name_WallEnemy: "ブロッケード",
        desc_WallEnemy: "重防壁機。動きは遅いが耐久力が高い。",
        name_ShieldEnemy: "ガーディアン",
        desc_ShieldEnemy: "防御機。回転するエネルギーシールドで守られている。",
        name_SpiralEnemy: "スピナー",
        desc_SpiralEnemy: "旋回機。全方位に螺旋状の弾幕を展開する。",
        name_MirageEnemy: "ミラージュ",
        desc_MirageEnemy: "幻影機。点滅して一時的に無敵状態になりダメージを回避する。",
        name_BomberEnemy: "ボマー",
        desc_BomberEnemy: "爆撃機。上下に揺れながら低速の機雷を投下する。",
        name_SniperEnemy: "スナイパー",
        desc_SniperEnemy: "狙撃機。停止してレーザー照準を合わせた後、高速弾を発射する。",
        name_PulsarEnemy: "パルサー",
        desc_PulsarEnemy: "放射機。周期的にリング状の衝撃波を放つ。",
        name_CloakerEnemy: "クローカー",
        desc_CloakerEnemy: "隠密機。透明状態で接近し、近距離で姿を現して奇襲する。",
        name_MiniCarrierEnemy: "ミニキャリア",
        desc_MiniCarrierEnemy: "母艦機。破壊時に小型ドローン2体を放出する。",
        name_Boss: "ドゥームズデイ",
        desc_Boss: "ステージの守護者。極めて危険な重武装機動要塞。",
        name_SpeedBoss: "インターセプター・アルファ",
        desc_SpeedBoss: "高機動指揮官機。スピードと連射で圧倒する。",
        name_FortressBoss: "フォートレス",
        desc_FortressBoss: "巨大装甲要塞。複数の砲台から圧倒的火力を展開する。",
        name_PhantomBoss: "ファントム",
        desc_PhantomBoss: "幽霊機。テレポートで予測不能な動きを見せ、分身攻撃を仕掛ける。",
        name_StormBoss: "ストームロード",
        desc_StormBoss: "嵐の具現。螺旋弾幕と電撃で戦場を支配する。",
        name_HydraBoss: "ヒュドラ",
        desc_HydraBoss: "多頭型殲滅機。3つの頭が独立して攻撃し休みなく襲いかかる。",
        name_NemesisBoss: "ネメシス",
        desc_NemesisBoss: "究極の宿敵。HP50%以下で激昂モードに移行し壊滅的攻撃を繰り出す。",

        // Ship Selection
        selectShipTitle: "機体選択",
        shipVanguard: "ヴァンガード",
        descVanguard: "バランス型。ハイパービーム装備。",
        shipStorm: "ストーム",
        descStorm: "高機動型。ファンネル装備。",
        shipBastion: "バスティオン",
        descBastion: "重装甲型。エネルギーシールド装備。",
        shipBlade: "ブレード",
        descBlade: "近接斬撃特化。高火力の斬撃波装備。",
        shipRay: "レイ",
        descRay: "レーザー特化。低威力貫通レーザー連射。",
        btnSelect: "選択"
    },
    kr: {
        subtitle: "사이버펑크 슈터",
        btnStart: "미션 시작",
        btnSettings: "설정",
        btnEncyclopedia: "도감",
        btnOk: "출격",
        labelDiff: "위협 수준",
        diffEasy: "쉬움",
        diffNormal: "보통",
        diffHard: "어려움",
        diffHell: "지옥",
        controlsHint: "WASD: 이동 | SPACE: 발사 | B: 폭탄",
        settingsTitle: "시스템 설정",
        encyclopediaTitle: "적 데이터베이스",
        groupGeneral: "일반",
        optLanguage: "언어",
        groupVisuals: "그래픽",
        optCrt: "CRT 효과",
        optParticles: "파티클",
        valLow: "낮음",
        valMed: "중간",
        valHigh: "높음",
        groupAudio: "오디오 (시뮬레이션)",
        optBgm: "BGM 볼륨",
        optSe: "SE 볼륨",
        btnBack: "돌아가기",
        gameOver: "게임 오버",
        pressRestart: "R 키를 눌러 재시작",
        paused: "일시 정지",
        pressResume: "P 또는 ESC로 재개",
        returnTitle: "🏠 타이틀 화면 (T)",

        // Dynamic
        score: "점수: ",
        weapon: "무기: ",
        rate: "연사: ",
        lives: "라이프: ",
        bomb: "폭탄: ",
        stage: "스테이지 ",
        funnel: "판넬: ",
        bossBattle: "⚠ 보스전 ⚠",
        stagePrefix: "★ 스테이지 ",
        stageSuffix: " ★",
        wave: "웨이브 ",
        clear: " 클리어",
        scoreFinal: "점수: ",
        stageFinal: " | 스테이지: ",
        stageFinal: " | 스테이지: ",
        diffHellLabel: "지옥",
        bossLabel: "보스",

        name_Enemy: "순찰 드론",
        desc_Enemy: "표준 순찰 유닛입니다. 직선으로 이동합니다.",
        name_SineWaveEnemy: "정찰기",
        desc_SineWaveEnemy: "정찰 유닛. 공격을 피하기 위해 사인파 패턴으로 이동합니다.",
        name_TrackingEnemy: "추적기",
        desc_TrackingEnemy: "추적 유닛. 플레이어의 높이를 추적합니다.",
        name_ZigZagEnemy: "요격기",
        desc_ZigZagEnemy: "민첩한 유닛. 날카로운 지그재그 패턴으로 이동합니다.",
        name_FormationEnemy: "편대기",
        desc_FormationEnemy: "전술 유닛. 편대를 이루어 조직적으로 공격합니다.",
        name_BurstEnemy: "포격기",
        desc_BurstEnemy: "중화기 유닛. 플레이어를 조준하여 연사합니다.",
        name_KamikazeEnemy: "자폭기",
        desc_KamikazeEnemy: "자폭 드론. 목표를 고정하고 고속으로 돌진합니다.",
        name_WallEnemy: "방벽기",
        desc_WallEnemy: "중장갑 유닛. 천천히 이동하며 피해를 흡수합니다.",
        name_ShieldEnemy: "수호자",
        desc_ShieldEnemy: "방어 유닛. 회전하는 에너지 보호막으로 보호받습니다.",
        name_SpiralEnemy: "회전기",
        desc_SpiralEnemy: "전방위 유닛. 나선형 패턴으로 탄막을 형성합니다.",
        name_MirageEnemy: "신기루",
        desc_MirageEnemy: "환영 유닛. 깜빡이며 일시적으로 무적 상태가 됩니다.",
        name_BomberEnemy: "폭격기",
        desc_BomberEnemy: "폭격 유닛. 상하로 흔들리며 저속 기뢰를 투하합니다.",
        name_SniperEnemy: "저격기",
        desc_SniperEnemy: "저격 유닛. 정지하여 조준 후 고속탄을 발사합니다.",
        name_PulsarEnemy: "펄서",
        desc_PulsarEnemy: "방사 유닛. 주기적으로 고리형 충격파를 방출합니다.",
        name_CloakerEnemy: "은신기",
        desc_CloakerEnemy: "은밀 유닛. 거의 투명한 상태로 접근하여 기습합니다.",
        name_MiniCarrierEnemy: "미니 캐리어",
        desc_MiniCarrierEnemy: "모함 유닛. 파괴 시 소형 드론 2기를 방출합니다.",
        name_Boss: "둠스데이",
        desc_Boss: "레벨 수호자. 매우 위험한 중무장 기동 요새입니다.",
        name_SpeedBoss: "인터셉터 알파",
        desc_SpeedBoss: "고기동 지휘관기. 속도와 연사로 압도합니다.",
        name_FortressBoss: "포트리스",
        desc_FortressBoss: "거대 장갑 요새. 다수의 포탑에서 압도적 화력을 전개합니다.",
        name_PhantomBoss: "팬텀",
        desc_PhantomBoss: "유령 기체. 순간이동으로 예측 불가한 움직임과 분신 공격을 합니다.",
        name_StormBoss: "스톰 로드",
        desc_StormBoss: "폭풍의 화신. 나선형 탄막과 번개로 전장을 지배합니다.",
        name_HydraBoss: "히드라",
        desc_HydraBoss: "다두형 섬멸기. 3개의 머리가 독립적으로 공격합니다.",
        name_NemesisBoss: "네메시스",
        desc_NemesisBoss: "궁극의 적. HP 50% 이하에서 격노 모드로 전환되어 파괴적 공격을 합니다.",

        // Ship Selection
        selectShipTitle: "선박 선택",
        shipVanguard: "VANGUARD",
        descVanguard: "균형 잡힌 유형입니다. 하이퍼 빔이 장착되어 있습니다.",
        shipStorm: "STORM",
        descStorm: "높은 이동성. 판넬로 시작합니다.",
        shipBastion: "BASTION",
        descBastion: "중장갑. 에너지 쉴드가 장착되어 있습니다.",
        shipBlade: "BLADE",
        descBlade: "근접 참격 특화. 고화력 참격파 장착.",
        shipRay: "RAY",
        descRay: "레이저 특화. 저위력 관통 레이저 연사.",
        btnSelect: "선택"
    },
    cn: {
        subtitle: "赛博朋克射击",
        btnStart: "开始任务",
        btnSettings: "设置",
        btnEncyclopedia: "图鉴",
        btnOk: "出击",
        labelDiff: "威胁等级",
        diffEasy: "简单",
        diffNormal: "普通",
        diffHard: "困难",
        diffHell: "地狱",
        controlsHint: "WASD: 移动 | SPACE: 射击 | B: 炸弹",
        settingsTitle: "系统配置",
        encyclopediaTitle: "敌人数据库",
        groupGeneral: "常规",
        optLanguage: "语言",
        groupVisuals: "画面",
        optCrt: "CRT特效",
        optParticles: "粒子",
        valLow: "低",
        valMed: "中",
        valHigh: "高",
        groupAudio: "音频 (模拟)",
        optBgm: "BGM 音量",
        optSe: "SE 音量",
        btnBack: "返回",
        gameOver: "游戏结束",
        pressRestart: "按 R 键重新开始",
        paused: "暂停",
        pressResume: "按 P 或 ESC 继续",
        returnTitle: "🏠 返回标题 (T)",

        // Dynamic
        score: "分数: ",
        weapon: "武器: ",
        rate: "射速: ",
        lives: "生命: ",
        bomb: "炸弹: ",
        stage: "关卡 ",
        funnel: "浮游炮: ",
        bossBattle: "⚠ BOSS 战 ⚠",
        stagePrefix: "★ 关卡 ",
        stageSuffix: " ★",
        wave: "波次 ",
        clear: " 完成",
        scoreFinal: "分数: ",
        stageFinal: " | 关卡: ",
        stageFinal: " | 关卡: ",
        diffHellLabel: "地狱",
        bossLabel: "首领",

        name_Enemy: "巡逻无人机",
        desc_Enemy: "标准巡逻单位。沿直线移动。",
        name_SineWaveEnemy: "侦察兵",
        desc_SineWaveEnemy: "侦察单位。以正弦波模式移动以躲避攻击。",
        name_TrackingEnemy: "猎人",
        desc_TrackingEnemy: "追踪单位。调整高度以追踪玩家。",
        name_ZigZagEnemy: "拦截者",
        desc_ZigZagEnemy: "敏捷单位。以锐利的之字形模式移动。",
        name_FormationEnemy: "编队机",
        desc_FormationEnemy: "战术单位。组成编队进行协调攻击。",
        name_BurstEnemy: "炮兵",
        desc_BurstEnemy: "重型单位。向玩家发射瞄准射击。",
        name_KamikazeEnemy: "神风",
        desc_KamikazeEnemy: "自爆无人机。锁定目标并高速冲锋。",
        name_WallEnemy: "封锁者",
        desc_WallEnemy: "重装甲。移动缓慢并吸收伤害。",
        name_ShieldEnemy: "守护者",
        desc_ShieldEnemy: "防御单位。由旋转的能量护盾保护。",
        name_SpiralEnemy: "旋转者",
        desc_SpiralEnemy: "全方位单位。以螺旋模式发射弹丸。",
        name_MirageEnemy: "幻影",
        desc_MirageEnemy: "幻影单位。闪烁变为暂时无敌以躲避伤害。",
        name_BomberEnemy: "轰炸机",
        desc_BomberEnemy: "轰炸单位。上下摆动同时投放低速水雷。",
        name_SniperEnemy: "狙击手",
        desc_SniperEnemy: "狙击单位。停下瞄准后发射高速射击。",
        name_PulsarEnemy: "脉冲星",
        desc_PulsarEnemy: "辐射单位。周期性释放环形冲击波。",
        name_CloakerEnemy: "隐身者",
        desc_CloakerEnemy: "隐形单位。近乎透明地接近，近距离突然现身突袭。",
        name_MiniCarrierEnemy: "迷你航母",
        desc_MiniCarrierEnemy: "载机单位。被摧毁时释放两架小型无人机。",
        name_Boss: "末日",
        desc_Boss: "关卡守护者。极其危险的重型武装堡垒。",
        name_SpeedBoss: "拦截者阿尔法",
        desc_SpeedBoss: "高机动指挥官机。利用速度和连射压倒对手。",
        name_FortressBoss: "堡垒",
        desc_FortressBoss: "巨型装甲要塞。多炮塔展开压倒性火力。",
        name_PhantomBoss: "幻影",
        desc_PhantomBoss: "幽灵机体。瞬移后从幻影位置发起攻击。",
        name_StormBoss: "风暴领主",
        desc_StormBoss: "自然之力。以螺旋弹幕和闪电覆盖战场。",
        name_HydraBoss: "九头蛇",
        desc_HydraBoss: "多头歼灭机。三个头独立攻击，不留喘息之机。",
        name_NemesisBoss: "复仇者",
        desc_NemesisBoss: "究极宿敌。HP降至50%以下时进入狂暴模式，发动毁灭性攻击。",

        // Ship Selection
        selectShipTitle: "选择飞船",
        shipVanguard: "先锋",
        descVanguard: "平衡型。装备超光束。",
        shipStorm: "风暴",
        descStorm: "高机动性。初始装备浮游炮。",
        shipBastion: "堡垒",
        descBastion: "重装甲。装备能量护盾。",
        shipBlade: "刃",
        descBlade: "近战斩击特化。装备高威力斩击波。",
        shipRay: "射线",
        descRay: "激光特化。低威力贯穿激光连射。",
        btnSelect: "选择"
    }
};

// ===================== SETTINGS MANAGER =====================
class SettingsManager {
    constructor(game) {
        this.game = game;
        this.defaults = {
            language: 'en',
            crt: true,
            particles: 1.0,
            bgmVolume: 50,
            seVolume: 80
        };
        this.current = { ...this.defaults };
        this.load();
        this.apply();
        this.setupUI();
    }

    load() {
        const saved = localStorage.getItem('nh_settings');
        if (saved) {
            try {
                this.current = { ...this.defaults, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to load settings', e);
            }
        }

        // Update UI controls to match loaded settings
        const langSelect = document.getElementById('setting-language');
        if (langSelect) langSelect.value = this.current.language;

        document.getElementById('crt-check').checked = this.current.crt;
        document.getElementById('setting-particles').value = this.current.particles;
        document.getElementById('setting-bgm').value = this.current.bgmVolume;
        document.getElementById('setting-se').value = this.current.seVolume;

        this.updateTexts();
    }

    save() {
        localStorage.setItem('nh_settings', JSON.stringify(this.current));
    }

    getText(key) {
        const lang = this.current.language;
        return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) ||
            (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) ||
            key;
    }

    updateTexts() {
        const lang = this.current.language;
        if (!TRANSLATIONS[lang]) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.getText(key);
            if (text) el.innerText = text;
        });

        // Update difficulty options
        if (this.game.ui && this.game.ui.difficultyOptions) {
            this.game.ui.difficultyOptions.forEach((el, idx) => {
                const keys = ['diffEasy', 'diffNormal', 'diffHard', 'diffHell'];
                el.innerText = this.getText(keys[idx]);
            });
        }
    }

    apply() {
        const container = document.getElementById('game-container');
        if (this.current.crt) {
            container.classList.add('crt-active', 'crt-effect');
        } else {
            container.classList.remove('crt-active', 'crt-effect');
        }
        this.updateTexts();
    }

    setupUI() {
        const langSelect = document.getElementById('setting-language');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                this.current.language = e.target.value;
                this.updateTexts();
                this.save();
            });
        }

        document.getElementById('crt-check').addEventListener('change', (e) => {
            this.current.crt = e.target.checked;
            this.apply();
            this.save();
        });

        document.getElementById('setting-particles').addEventListener('change', (e) => {
            this.current.particles = parseFloat(e.target.value);
            this.save();
        });

        document.getElementById('setting-bgm').addEventListener('input', (e) => {
            this.current.bgmVolume = parseInt(e.target.value);
            this.save();
        });

        document.getElementById('setting-se').addEventListener('input', (e) => {
            this.current.seVolume = parseInt(e.target.value);
            this.save();
        });
    }
}

// ===================== PARALLAX LAYER =====================
class Layer {
    constructor(game, speedModifier, color, count) {
        this.game = game;
        this.speedModifier = speedModifier;
        this.color = color;
        this.stars = [];
        for (let i = 0; i < (count || 50); i++) {
            this.stars.push({
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                size: Math.random() * 2 + 0.5,
                speedFactor: 0.8 + Math.random() * 0.4, // Individual parallax variance
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.02 + Math.random() * 0.05
            });
        }
    }
    update() {
        this.stars.forEach(star => {
            star.x -= this.game.speed * this.speedModifier * star.speedFactor;
            star.twinkle += star.twinkleSpeed;
            if (star.x < 0) {
                star.x = this.game.width;
                star.y = Math.random() * this.game.height;
            }
        });
    }
    draw(ctx) {
        ctx.save();
        this.stars.forEach(star => {
            const alpha = 0.5 + Math.sin(star.twinkle) * 0.5; // Twinkle effect
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();
    }
}

// DIFFICULTY moved to js/Constants.js


// ===================== STATS MANAGER =====================
class StatsManager {
    constructor(game) {
        this.game = game;
        this.kills = {}; // Map of enemy ID -> count
        this.load();
    }

    load() {
        const saved = localStorage.getItem('nh_stats');
        if (saved) {
            try {
                this.kills = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load stats', e);
                this.kills = {};
            }
        }
    }

    save() {
        localStorage.setItem('nh_stats', JSON.stringify(this.kills));
    }

    recordKill(enemyId) {
        if (!this.kills[enemyId]) this.kills[enemyId] = 0;
        this.kills[enemyId]++;
        this.save();
    }

    getKills(enemyId) {
        return this.kills[enemyId] || 0;
    }
}

// ===================== GAME =====================
class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.input = new InputHandler();
        this.difficulty = DIFFICULTY.NORMAL; // Default
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.obstacles = [];
        this.beamEffects = [];
        this.bombEffects = [];
        this.levelManager = new LevelManager(this);
        this.backgroundLayers = [
            new Layer(this, 0.2, '#222', 30),
            new Layer(this, 0.5, '#555', 40),
            new Layer(this, 1.0, '#aaa', 50)
        ];
        this.score = 0;
        this.lives = this.difficulty.lives;
        this.bombs = this.difficulty.bombs;
        this.gameOver = false;
        this.gameStarted = false;
        this.paused = false;
        this.selectedDifficulty = 1; // 0=EASY, 1=NORMAL, 2=HARD, 3=HELL
        this.selectedShipType = 'VANGUARD'; // Default ship
        this.bossModeActive = false;

        // Combo system
        this.combo = 0;
        this.comboTimer = 0;
        this.comboDuration = 120; // 2 seconds at 60fps
        this.maxCombo = 0;

        // Screen shake
        this.shakeIntensity = 0;
        this.shakeDuration = 0;

        // Floating text effects
        this.floatingTexts = [];

        this.ui = {
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            bombs: document.getElementById('bombs'),
            weapon: document.getElementById('weapon'),
            fireRate: document.getElementById('fire-rate'),
            stage: document.getElementById('stage'),
            waveInfo: document.getElementById('wave-info'),
            startScreen: document.getElementById('start-screen'),
            mainMenu: document.getElementById('main-menu'),
            settingsModal: document.getElementById('settings-modal'),
            shipSelectionScreen: document.getElementById('ship-selection-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            pauseScreen: document.getElementById('pause-screen'),
            pauseTitle: document.getElementById('pause-title-btn'),
            finalScore: document.getElementById('final-score'),
            funnelCount: document.getElementById('funnel-count'),
            difficultySelector: document.getElementById('difficulty-selector'),
            difficultyOptions: document.querySelectorAll('.diff-option'),
            btnStart: document.getElementById('btn-start'),
            btnSettings: document.getElementById('btn-settings'),
            btnSettingsBack: document.getElementById('btn-settings-back'),
            btnSelectShipBack: document.getElementById('btn-select-ship-back'),
            btnShipOk: document.getElementById('btn-ship-ok')
        };

        this.soundManager = new SoundManager(this);
        this.settings = new SettingsManager(this);
        this.stats = new StatsManager(this);
        this.encyclopedia = new Encyclopedia(this);
        this.debug = new DebugMode(this);

        // Secret Code Listener
        this.input.onSecretCode = (code) => {
            if (code === 'BOSS') {
                this.toggleBossMode();
            }
        };


        // Menu Buttons
        this.ui.btnStart.addEventListener('click', () => {
            this.ui.startScreen.classList.add('hidden');
            this.ui.shipSelectionScreen.classList.remove('hidden');
        });

        if (this.ui.btnShipOk) {
            this.ui.btnShipOk.addEventListener('click', () => {
                this.ui.shipSelectionScreen.classList.add('hidden');
                this.startGame();
            });
        }

        // Ship Selection Cards
        document.querySelectorAll('.ship-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.ship-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedShipType = card.dataset.ship;
                this.soundManager.play('se_select');
            });
        });

        // Initialize default selection
        const defaultCard = document.querySelector(`.ship-card[data-ship="${this.selectedShipType}"]`);
        if (defaultCard) defaultCard.classList.add('selected');

        this.ui.btnSelectShipBack.addEventListener('click', () => {
            this.ui.shipSelectionScreen.classList.add('hidden');
            this.ui.startScreen.classList.remove('hidden');
        });

        this.ui.btnSettings.addEventListener('click', () => {
            this.ui.startScreen.classList.add('hidden');
            this.ui.settingsModal.classList.remove('hidden');
        });

        this.ui.btnSettingsBack.addEventListener('click', () => {
            this.ui.settingsModal.classList.add('hidden');
            this.ui.startScreen.classList.remove('hidden');
        });

        // Difficulty selection
        this.ui.difficultyOptions.forEach((el, idx) => {
            el.addEventListener('click', () => {
                if (this.gameStarted) return;
                this.selectedDifficulty = idx;
                this.ui.difficultyOptions.forEach(o => o.classList.remove('selected'));
                el.classList.add('selected');
            });
        });

        // Pause -> Title button
        this.ui.pauseTitle.addEventListener('click', () => {
            this.returnToTitle();
        });

        window.addEventListener('keydown', e => {
            if (!this.gameStarted) {
                // If settings modal is open, maybe allow ESC to go back?
                if (!this.ui.settingsModal.classList.contains('hidden')) {
                    if (e.key === 'Escape') {
                        this.ui.settingsModal.classList.add('hidden');
                        this.ui.startScreen.classList.remove('hidden');
                    }
                    return;
                }

                // Arrow keys to change difficulty on start screen
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    this.selectedDifficulty = Math.max(0, this.selectedDifficulty - 1);
                    this.ui.difficultyOptions.forEach(o => o.classList.remove('selected'));
                    this.ui.difficultyOptions[this.selectedDifficulty].classList.add('selected');
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    this.selectedDifficulty = Math.min(3, this.selectedDifficulty + 1);
                    this.ui.difficultyOptions.forEach(o => o.classList.remove('selected'));
                    this.ui.difficultyOptions[this.selectedDifficulty].classList.add('selected');
                } else if (e.key === 'Enter' || e.key === ' ') {
                    this.startGame();
                }
            } else if (this.gameOver && e.key.toLowerCase() === 'r') {
                this.restartGame();
            } else if (this.gameStarted && !this.gameOver && (e.key === 'p' || e.key === 'P' || e.key === 'Escape')) {
                this.togglePause();
            } else if (this.paused && e.key.toLowerCase() === 't') {
                this.returnToTitle();
            }
        });
    }

    applyDifficulty() {
        const keys = Object.keys(DIFFICULTY);
        this.difficulty = DIFFICULTY[keys[this.selectedDifficulty]];
    }

    useBomb() {
        if (this.bombs <= 0 && !(this.debug && this.debug.cheats.infiniteBombs)) return;
        if (!(this.debug && this.debug.cheats.infiniteBombs)) {
            this.bombs--;
        }
        this.ui.bombs.innerText = this.settings.getText('bomb') + '💣'.repeat(this.bombs);
        this.soundManager.play('se_explosion'); // Bomb sound

        // Create beam effect
        this.beamEffects.push(new BeamEffect(this));

        // Kill all non-boss enemies
        this.enemies.forEach(e => {
            if (!(e instanceof Boss)) {
                e.lives = 0;
                // Trigger death effects
            }
        });

        // Clear all enemy projectiles
        this.projectiles = this.projectiles.filter(p => p.isPlayerProjectile);

        // Damage boss if present
        this.enemies.forEach(e => {
            if (e instanceof Boss) {
                e.lives -= 15;
                e.onHit();
            }
        });

        // Lots of explosions
        for (let i = 0; i < 20; i++) {
            const rx = Math.random() * this.width;
            const ry = Math.random() * this.height;
            this.createExplosion(rx, ry, ['#0ff', '#ff0', '#f0f', '#fff'][Math.floor(Math.random() * 4)], 8);
        }

        // Brief invincibility
        this.player.invincible = Math.max(this.player.invincible, 45);
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            this.ui.pauseScreen.classList.remove('hidden');
            // Update status panel
            document.getElementById('pause-ship').textContent = this.player.type;
            document.getElementById('pause-hp').textContent = this.lives;
            document.getElementById('pause-weapon').textContent = this.player.weaponType;
            document.getElementById('pause-rate').textContent = '★'.repeat(this.player.fireRateLevel) + '☆'.repeat(5 - this.player.fireRateLevel);
            document.getElementById('pause-bomb').textContent = this.bombs;
            const shieldVal = this.player.type === 'BASTION' ? (this.player.shield + '/' + this.player.maxShield) : '—';
            document.getElementById('pause-shield').textContent = shieldVal;
            document.getElementById('pause-funnel').textContent = this.player.funnels.length > 0 ? this.player.funnels.length : '—';
            document.getElementById('pause-score').textContent = this.score;
            document.getElementById('pause-stage').textContent = this.levelManager.stage + '-' + (this.levelManager.wave + 1);

            // Show/hide cheat panel based on debug unlock
            const cheatPanel = document.getElementById('pause-cheat-panel');
            if (this.debug && this.debug.unlocked) {
                cheatPanel.classList.remove('hidden');
                // Sync toggle button states
                cheatPanel.querySelectorAll('.pause-cheat-btn').forEach(btn => {
                    const key = btn.dataset.cheat;
                    const isOn = this.debug.cheats[key];
                    const labels = {
                        invincible: '🛡 INVINCIBLE',
                        infiniteBombs: '💣 INF. BOMBS',
                        maxPower: '⚡ MAX POWER',
                        speedBoost: '🚀 SPEED ×2',
                        oneHitKill: '💀 ONE-HIT KILL'
                    };
                    btn.textContent = (labels[key] || key) + ': ' + (isOn ? 'ON' : 'OFF');
                    btn.classList.toggle('cheat-on', isOn);
                });
                // Setup event listeners (once)
                if (!this._pauseCheatsInit) {
                    this._pauseCheatsInit = true;
                    cheatPanel.querySelectorAll('.pause-cheat-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const key = btn.dataset.cheat;
                            this.debug.cheats[key] = !this.debug.cheats[key];
                            const isOn = this.debug.cheats[key];
                            const labels = {
                                invincible: '🛡 INVINCIBLE',
                                infiniteBombs: '💣 INF. BOMBS',
                                maxPower: '⚡ MAX POWER',
                                speedBoost: '🚀 SPEED ×2',
                                oneHitKill: '💀 ONE-HIT KILL'
                            };
                            btn.textContent = (labels[key] || key) + ': ' + (isOn ? 'ON' : 'OFF');
                            btn.classList.toggle('cheat-on', isOn);
                            // Sync with debug overlay buttons
                            const overlayBtn = document.querySelector(`#debug-overlay .debug-toggle[data-cheat="${key}"]`);
                            if (overlayBtn) {
                                overlayBtn.textContent = isOn ? 'ON' : 'OFF';
                                overlayBtn.classList.toggle('debug-on', isOn);
                            }
                            if (key === 'maxPower' && isOn && this.player) {
                                this.player.fireRateLevel = 5;
                                this.updateFireRateUI();
                            }
                        });
                    });
                    document.getElementById('pause-cheat-skip').addEventListener('click', () => {
                        if (this.gameStarted && !this.gameOver && this.levelManager) {
                            this.levelManager.wave = this.levelManager.wavesPerStage;
                            this.levelManager.waveEnemiesRemaining = 0;
                            this.levelManager.activeEnemiesInWave = 0;
                            this.enemies.forEach(e => e.markedForDeletion = true);
                            this.projectiles = this.projectiles.filter(p => p.isPlayerProjectile);
                        }
                    });
                    document.getElementById('pause-cheat-lives').addEventListener('click', () => {
                        if (this.gameStarted) {
                            this.lives += 5;
                            this.ui.lives.innerText = this.settings.getText('lives') + this.lives;
                            document.getElementById('pause-hp').textContent = this.lives;
                        }
                    });
                    document.getElementById('pause-cheat-bombs').addEventListener('click', () => {
                        if (this.gameStarted) {
                            this.bombs += 5;
                            this.ui.bombs.innerText = this.settings.getText('bomb') + '💣'.repeat(this.bombs);
                            document.getElementById('pause-bomb').textContent = this.bombs;
                        }
                    });
                }
            } else {
                cheatPanel.classList.add('hidden');
            }
        } else {
            this.ui.pauseScreen.classList.add('hidden');
            lastTime = performance.now();
            this.soundManager.play('se_select');
            animate(performance.now());
        }
    }

    returnToTitle() {
        this.paused = false;
        this.gameStarted = false;
        this.gameOver = false;
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.obstacles = [];
        this.powerUps = [];
        this.obstacles = [];
        this.beamEffects = [];
        this.bombEffects = []; // New: Manager for complex bomb visuals
        this.score = 0;
        this.ui.pauseScreen.classList.add('hidden');
        this.ui.gameOverScreen.classList.add('hidden');
        this.ui.startScreen.classList.remove('hidden');
        this.ui.score.innerText = this.settings.getText('score') + '0';
        this.ui.weapon.innerText = this.settings.getText('weapon') + 'DEFAULT';
        this.ui.weapon.className = '';
        this.ui.fireRate.innerText = this.settings.getText('rate') + '☆☆☆☆☆';
        this.ui.funnelCount.innerText = '';
        this.ui.stage.innerText = this.settings.getText('stage') + '1';
        this.ui.waveInfo.innerText = '';
        this.soundManager.stopBgm();
    }

    toggleBossMode() {
        this.bossModeActive = !this.bossModeActive;
        this.soundManager.play('se_powerup'); // Or a special boss-like sound

        // Visual feedback if game is running
        if (this.gameStarted && !this.gameOver) {
            this.createExplosion(this.player.x, this.player.y, '#f0f', 30);
            if (this.levelManager) {
                const msg = this.bossModeActive ? "BOSS MODE ACTIVE" : "BOSS MODE DEACTIVATED";
                this.levelManager.showNotification(msg, '#f0f');
            }
        }
    }

    startGame() {
        try {
            this.applyDifficulty();
            this.lives = this.difficulty.lives;
            this.bombs = this.difficulty.bombs;
            this.player = new Player(this);
            this.levelManager = new LevelManager(this);
            this.gameStarted = true;
            this.ui.startScreen.classList.add('hidden');
            this.ui.lives.innerText = this.settings.getText('lives') + this.lives;
            this.ui.bombs.innerText = this.settings.getText('bomb') + '💣'.repeat(this.bombs);
            lastTime = performance.now();
            this.soundManager.play('bgm_main', true);
            animate(performance.now());
        } catch (e) {
            console.error(e);
            alert('Error starting game: ' + e.message + '\n' + e.stack);
        }
    }

    restartGame() {
        this.player = new Player(this);
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.obstacles = [];
        this.powerUps = [];
        this.obstacles = [];
        this.beamEffects = [];
        this.bombEffects = [];
        this.levelManager = new LevelManager(this);
        this.score = 0;
        this.lives = this.difficulty.lives;
        this.bombs = this.difficulty.bombs;
        this.gameOver = false;
        this.paused = false;
        this.combo = 0;
        this.comboTimer = 0;
        this.maxCombo = 0;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.floatingTexts = [];
        this.ui.gameOverScreen.classList.add('hidden');
        this.ui.score.innerText = this.settings.getText('score') + '0';
        this.ui.lives.innerText = this.settings.getText('lives') + this.lives;
        this.ui.bombs.innerText = this.settings.getText('bomb') + '💣'.repeat(this.bombs);
        this.ui.weapon.innerText = this.settings.getText('weapon') + 'DEFAULT';
        this.ui.weapon.className = '';
        this.ui.fireRate.innerText = this.settings.getText('rate') + '☆☆☆☆☆';
        this.ui.stage.innerText = this.settings.getText('stage') + '1';
        this.ui.waveInfo.innerText = '';
        this.soundManager.play('bgm_main', true);
        lastTime = performance.now();
        animate(performance.now());
    }

    update(deltaTime) {
        if (!this.gameStarted || this.gameOver || this.paused) return;

        // Background
        this.backgroundLayers.forEach(layer => layer.update());

        // Player
        // Debug: speed boost
        if (this.debug && this.debug.cheats.speedBoost) {
            const origSpeed = this.player.speed;
            this.player.speed *= 2;
            this.player.update();
            this.player.speed = origSpeed;
        } else {
            this.player.update();
        }

        // Debug: max power continuous apply
        if (this.debug && this.debug.cheats.maxPower && this.player.fireRateLevel < 5) {
            this.player.fireRateLevel = 5;
            this.updateFireRateUI();
        }

        // Beam effects
        this.beamEffects.forEach(b => b.update());
        this.beamEffects = this.beamEffects.filter(b => b.active);

        // Bomb effects
        this.bombEffects.forEach(b => b.update());
        this.bombEffects = this.bombEffects.filter(b => b.active);

        // Projectiles
        // Projectiles
        this.projectiles.forEach(p => p.update());

        // Bullet cancellation (Player projectiles vs Enemy projectiles)
        const playerProjs = this.projectiles.filter(p => p.isPlayerProjectile && p.cancelsBullets);
        const enemyProjs = this.projectiles.filter(p => !p.isPlayerProjectile);

        playerProjs.forEach(pp => {
            enemyProjs.forEach(ep => {
                if (!pp.markedForDeletion && !ep.markedForDeletion && this.checkProjectileCollision(pp, ep)) {
                    ep.markedForDeletion = true;
                    this.createExplosion(ep.x, ep.y, '#fff', 3); // Small spark
                }
            });
        });

        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

        // Obstacles
        this.obstacles.forEach(o => o.update());
        this.obstacles = this.obstacles.filter(o => !o.markedForDeletion);
        if (this.player.invincible <= 0) {
            this.obstacles.forEach(o => {
                if (this.checkCollision(this.player, o)) {
                    this.takeDamage();
                }
            });
        }
        this.obstacles.forEach(o => {
            this.projectiles.forEach(p => {
                if (p.isPlayerProjectile && this.checkCollision(p, o)) {
                    p.markedForDeletion = true;
                    this.createExplosion(p.x, p.y, '#888', 3);
                }
            });
        });

        // PowerUps
        this.powerUps.forEach(p => p.update());
        this.powerUps = this.powerUps.filter(p => !p.markedForDeletion);
        this.powerUps.forEach(p => {
            if (this.checkCollision(this.player, p)) {
                p.markedForDeletion = true;
                if (p.type === 'LIFE') {
                    this.lives++;
                    this.ui.lives.innerText = this.settings.getText('lives') + this.lives;
                } else if (p.type === 'RATE') {
                    this.player.fireRateLevel = Math.min(5, this.player.fireRateLevel + 1);
                    this.updateFireRateUI();
                } else if (p.type === 'BOMB') {
                    this.bombs++;
                    this.ui.bombs.innerText = this.settings.getText('bomb') + '💣'.repeat(this.bombs);
                } else if (p.type === 'FUNNEL') {
                    this.player.addFunnel();
                    this.ui.funnelCount.innerText = this.settings.getText('funnel') + '◆'.repeat(this.player.funnels.length);
                } else {
                    // Unknown weapon type → score bonus
                    this.score += 100;
                    this.ui.score.innerText = 'SCORE: ' + this.score;
                }
                this.soundManager.play('se_powerup');
            }
        });

        // Enemies
        this.enemies.forEach(e => {
            e.update();
            if (this.player.invincible <= 0 && this.checkCollision(this.player, e) && !e.markedForDeletion && !(e.isPhased)) {
                this.takeDamage();
            }
            this.projectiles.forEach(p => {
                if (this.checkCollision(p, e) && p.isPlayerProjectile && !e.markedForDeletion && !(e.isPhased)) {
                    e.lives -= (this.debug && this.debug.cheats.oneHitKill) ? 9999 : (p.damage || 1);
                    e.onHit();
                    if (!p.piercing) p.markedForDeletion = true;
                    if (e.lives > 0) this.createExplosion(p.x, p.y, '#fff', 3);
                }
            });
        });
        // Enemy projectile-player collision
        if (this.player.invincible <= 0) {
            this.projectiles.forEach(p => {
                if (!p.isPlayerProjectile && this.checkCollision(p, this.player)) {
                    p.markedForDeletion = true;
                    this.takeDamage();
                }
            });
        }
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // Level Management
        this.levelManager.update(deltaTime);

        // UI updates
        this.ui.stage.innerText = this.settings.getText('stage') + this.levelManager.stage;
        if (this.levelManager.bossActive) {
            this.ui.waveInfo.innerText = this.settings.getText('bossBattle');
            this.ui.waveInfo.style.color = '#f00';
        } else if (this.levelManager.stageTransition) {
            this.ui.waveInfo.innerText = this.settings.getText('stagePrefix') + this.levelManager.stage + this.settings.getText('stageSuffix');
            this.ui.waveInfo.style.color = '#ff0';
        } else {
            this.ui.waveInfo.innerText = this.settings.getText('wave') + (this.levelManager.wave + 1) + '/' + this.levelManager.wavesPerStage;
            this.ui.waveInfo.style.color = '#aaa';
        }

        // Particles
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);

        // Combo timer
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer <= 0) {
                this.combo = 0;
            }
        }

        // Screen shake decay
        if (this.shakeDuration > 0) {
            this.shakeDuration--;
            if (this.shakeDuration <= 0) this.shakeIntensity = 0;
        }

        // Floating texts
        this.floatingTexts.forEach(ft => {
            ft.y -= ft.vy;
            ft.life--;
            ft.alpha = ft.life / ft.maxLife;
        });
        this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);
    }

    updateFireRateUI() {
        const lvl = this.player.fireRateLevel;
        let stars = '';
        for (let i = 0; i < 5; i++) stars += i < lvl ? '★' : '☆';
        this.ui.fireRate.innerText = this.settings.getText('rate') + stars;
    }

    draw(ctx) {
        this.backgroundLayers.forEach(layer => layer.draw(ctx));
        this.obstacles.forEach(o => o.draw(ctx));
        this.powerUps.forEach(p => p.draw(ctx));
        this.player.draw(ctx);

        // Draw player HP bar above ship
        if (this.gameStarted && !this.gameOver) {
            const px = this.player.x;
            const py = this.player.y - 12;
            const barW = this.player.width;
            const barH = 4;
            const maxHP = this.difficulty.lives;
            const ratio = Math.max(0, Math.min(1, this.lives / maxHP));
            // Background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(px, py, barW, barH);
            // HP fill
            let hpColor;
            if (ratio > 0.6) hpColor = '#0f0';
            else if (ratio > 0.3) hpColor = '#ff0';
            else hpColor = '#f00';
            ctx.fillStyle = hpColor;
            ctx.fillRect(px, py, barW * ratio, barH);
            // Border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(px, py, barW, barH);
            ctx.lineWidth = 1;
        }

        this.projectiles.forEach(p => p.draw(ctx));
        this.enemies.forEach(e => e.draw(ctx));
        this.beamEffects.forEach(b => b.draw(ctx));
        this.bombEffects.forEach(b => b.draw(ctx));
        this.particles.forEach(p => p.draw(ctx));

        // Floating score texts
        this.floatingTexts.forEach(ft => {
            ctx.save();
            ctx.globalAlpha = ft.alpha;
            ctx.fillStyle = ft.color;
            ctx.font = `bold ${ft.size}px Orbitron, Arial`;
            ctx.textAlign = 'center';
            ctx.shadowBlur = 6;
            ctx.shadowColor = ft.color;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        });

        // Combo display
        if (this.combo >= 2) {
            ctx.save();
            const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.1;
            const comboSize = Math.min(48, 24 + this.combo * 2) * pulse;
            ctx.font = `bold ${comboSize}px Orbitron, Arial`;
            ctx.textAlign = 'right';
            ctx.fillStyle = this.combo >= 10 ? '#f0f' : this.combo >= 5 ? '#ff0' : '#0ff';
            ctx.shadowBlur = 12;
            ctx.shadowColor = ctx.fillStyle;
            ctx.globalAlpha = Math.min(1, this.comboTimer / 20);
            ctx.fillText(`×${this.combo} COMBO`, this.width - 20, 80);
            // Multiplier label
            ctx.font = 'bold 14px Orbitron, Arial';
            ctx.fillText(`SCORE ×${Math.min(5, 1 + Math.floor(this.combo / 3))}`, this.width - 20, 100);
            ctx.restore();
        }
    }

    checkCollision(rect1, rect2) {
        // Reduced hitbox for player to make dodging easier
        let r1x = rect1.x, r1y = rect1.y, r1w = rect1.width, r1h = rect1.height;
        let r2x = rect2.x, r2y = rect2.y, r2w = rect2.width, r2h = rect2.height;

        if (rect1 === this.player) {
            const scale = 0.4; // 40% hitbox size
            const cx = rect1.x + rect1.width / 2;
            const cy = rect1.y + rect1.height / 2;
            r1w = rect1.width * scale;
            r1h = rect1.height * scale;
            r1x = cx - r1w / 2;
            r1y = cy - r1h / 2;
        } else if (rect2 === this.player) {
            const scale = 0.4;
            const cx = rect2.x + rect2.width / 2;
            const cy = rect2.y + rect2.height / 2;
            r2w = rect2.width * scale;
            r2h = rect2.height * scale;
            r2x = cx - r2w / 2;
            r2y = cy - r2h / 2;
        }

        return (
            r1x < r2x + r2w &&
            r1x + r1w > r2x &&
            r1y < r2y + r2h &&
            r1y + r1h > r2y
        );
    }

    checkProjectileCollision(p1, p2) {
        return (
            p1.x < p2.x + p2.width &&
            p1.x + p1.width > p2.x &&
            p1.y < p2.y + p2.height &&
            p1.y + p1.height > p2.y
        );
    }

    createExplosion(x, y, color, count = 10) {
        // Play sound (throttled slightly if needed, but simple for now)
        if (Math.random() < 0.3) this.soundManager.play('se_explosion');

        const mult = this.settings ? this.settings.current.particles : 1.0;
        const finalCount = Math.floor(count * mult);
        for (let i = 0; i < finalCount; i++) {
            this.particles.push(new Particle(this, x, y, color));
        }
    }

    addFloatingText(x, y, text, color = '#fff', size = 16, life = 40) {
        this.floatingTexts.push({
            x, y, text, color, size,
            life, maxLife: life,
            alpha: 1, vy: 1.2
        });
    }

    // Called by Enemy.update on kill to track combo
    onEnemyKilled(enemy) {
        this.combo++;
        this.comboTimer = this.comboDuration;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        // Combo score bonus
        const multiplier = Math.min(5, 1 + Math.floor(this.combo / 3));
        const bonus = enemy.score * (multiplier - 1);
        if (bonus > 0) {
            this.score += bonus;
            this.ui.score.innerText = 'SCORE: ' + this.score;
        }
        // Floating score text
        const scoreText = '+' + (enemy.score * multiplier);
        const color = this.combo >= 10 ? '#f0f' : this.combo >= 5 ? '#ff0' : '#fff';
        this.addFloatingText(
            enemy.x + enemy.width / 2,
            enemy.y,
            scoreText, color, Math.min(20, 12 + this.combo), 35
        );
    }

    triggerBomb() {
        if (this.bombs <= 0) return;
        this.bombs--;
        this.ui.bombs.innerText = this.settings.getText('bomb') + '💣'.repeat(this.bombs);
        this.soundManager.play('se_explosion');
        // Screen shake on bomb
        this.shakeIntensity = 12;
        this.shakeDuration = 20;

        // Common effects
        this.projectiles = this.projectiles.filter(p => p.isPlayerProjectile); // Clear enemy bullets
        this.player.invincible = 120; // 2 sec invincibility

        // Unique effects based on ship type
        const type = this.player.type;

        if (type === 'VANGUARD') {
            // "Nuclear Blast" - Screen wide high damage
            this.bombEffects.push(new NuclearBlastEffect(this));
            this.enemies.forEach(e => {
                e.lives -= 50;
                e.hitFlash = 10;
                // Never set markedForDeletion=true here directly for bosses.
                // Just let their update() catch lives <= 0.
            });
        } else if (type === 'STORM') {
            // "Thunderstorm" - Random lightning strikes
            this.bombEffects.push(new ThunderstormEffect(this));
        } else if (type === 'BASTION') {
            // "Aegis Overload" - Restore shield + huge shockwave
            this.player.shield = this.player.maxShield;
            this.bombEffects.push(new AegisOverloadEffect(this));
        } else if (type === 'BLADE') {
            // "Omnislash" - Instant slash on all enemies
            this.bombEffects.push(new OmnislashEffect(this));
            this.enemies.forEach(e => {
                e.lives -= 80; // Massive damage
                // No direct deletion here.
            });
        } else if (type === 'RAY') {
            // "Hyperion Beam" - Giant sustained beam
            this.bombEffects.push(new HyperionBeamEffect(this));
        }
    }

    takeDamage() {
        if (this.debug && this.debug.cheats.invincible) return;
        if (this.player.invincible > 0) return; // Already invincible

        // Check for Bastion shield
        if (this.player.type === 'BASTION' && this.player.shield > 0) {
            this.player.shield--;
            this.player.shieldRegenTimer = 0; // Reset regen timer on hit
            this.player.invincible = 90; // Longer invincibility for shield break
            this.createExplosion(this.player.x, this.player.y, '#0ff', 10); // Shield break effect
            this.soundManager.play('se_shield_hit'); // Shield hit sound
            return;
        }

        this.lives--;
        this.soundManager.play('se_damage');
        this.ui.lives.innerText = this.settings.getText('lives') + this.lives;
        this.player.invincible = 120; // 2 seconds invincibility
        this.createExplosion(this.player.x, this.player.y, '#f00', 20);
        // Screen shake on damage
        this.shakeIntensity = 8;
        this.shakeDuration = 15;
        // Reset combo on damage
        this.combo = 0;
        this.comboTimer = 0;

        // Reset weapon power on death
        this.player.fireRateLevel = Math.max(0, this.player.fireRateLevel - 1);
        this.updateFireRateUI();

        // Lose a funnel if any
        if (this.player.funnels.length > 0) {
            this.player.funnels.pop();
            this.ui.funnelCount.innerText = this.settings.getText('funnel') + '◆'.repeat(this.player.funnels.length);
        }

        if (this.lives <= 0) {
            this.triggerGameOver();
        }
    }

    triggerGameOver() {
        this.gameOver = true;
        this.ui.gameOverScreen.querySelector('h1').innerText = this.settings.getText('gameOver');
        this.ui.gameOverScreen.classList.remove('hidden');
        let diffLabel = this.difficulty.label;
        if (diffLabel === 'HELL' || diffLabel === '地獄') {
            diffLabel = this.settings.getText('diffHellLabel');
        } else {
            // For others, we might want to map them too if we want full localization of difficulty labels in HUD?
            // But DIFFICULTY object has hardcoded labels.
            // We can map them dynamically.
            // But for now let's just use what we have or map if possible.
            // Actually, let's just use the localized keys.
            const keys = ['diffEasy', 'diffNormal', 'diffHard', 'diffHell'];
            diffLabel = this.settings.getText(keys[this.selectedDifficulty]);
        }

        this.ui.finalScore.innerText = this.settings.getText('scoreFinal') + this.score + this.settings.getText('stageFinal') + this.levelManager.stage + ' | ' + diffLabel;
    }
}

// ===================== INIT =====================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(canvas.width, canvas.height);
game.soundManager.loadSounds();
let lastTime = 0;

function animate(timeStamp) {
    if (game.paused) return;
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    game.update(deltaTime);

    // Screen shake
    // Draw Game
    ctx.save();
    // Screen shake
    if (game.shakeIntensity > 0 && game.shakeDuration > 0) {
        const sx = (Math.random() - 0.5) * game.shakeIntensity;
        const sy = (Math.random() - 0.5) * game.shakeIntensity;
        ctx.translate(sx, sy);
    }
    game.draw(ctx);
    ctx.restore();

    if (!game.gameOver) {
        requestAnimationFrame(animate);
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    game.width = canvas.width;
    game.height = canvas.height;
});

// ===================== BOMB EFFECTS =====================

class BombEffect {
    constructor(game) {
        this.game = game;
        this.active = true;
        this.timer = 0;
    }
    update() { this.timer++; }
    draw(ctx) { }
}

class NuclearBlastEffect extends BombEffect {
    constructor(game) {
        super(game);
        this.duration = 60;
    }
    update() {
        super.update();
        if (this.timer >= this.duration) this.active = false;
    }
    draw(ctx) {
        ctx.save();
        // White flash out
        let alpha = 0;
        if (this.timer < 10) alpha = this.timer / 10;
        else alpha = 1 - (this.timer - 10) / 50;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        // Expanding ring
        if (this.timer > 5) {
            ctx.strokeStyle = `rgba(255, 100, 0, ${alpha * 0.8})`;
            ctx.lineWidth = 50;
            ctx.beginPath();
            ctx.arc(this.game.width / 2, this.game.height / 2, this.timer * 20, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }
}

class ThunderstormEffect extends BombEffect {
    constructor(game) {
        super(game);
        this.duration = 180; // 3 seconds
        this.strikes = [];
    }
    update() {
        super.update();
        if (this.timer >= this.duration) this.active = false;

        // Spawn lightning strikes
        if (this.timer % 5 === 0) {
            const x = Math.random() * this.game.width;
            const y = Math.random() * this.game.height;
            this.strikes.push({ x, y, life: 10 });
            this.game.createExplosion(x, y, '#0ff', 6); // Reduced particle count

            // Damage enemies near strike
            const radiusSq = 100 * 100;
            this.game.enemies.forEach(e => {
                const dx = e.x - x, dy = e.y - y;
                if (dx * dx + dy * dy < radiusSq) {
                    e.lives -= 20;
                    e.hitFlash = 5;
                    // No direct markedForDeletion=true here.
                }
            });
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2; // Thinner for performance

        this.strikes.forEach(s => {
            if (s.life > 0) {
                ctx.globalAlpha = s.life / 10;
                ctx.beginPath();
                ctx.moveTo(s.x, 0);

                let currX = s.x;
                let currY = 0;
                while (currY < s.y) {
                    currX += (Math.random() - 0.5) * 30;
                    currY += 50; // Larger steps for fewer line segments
                    ctx.lineTo(currX, currY);
                }
                ctx.stroke();

                // Simple impact flash (no arc)
                ctx.fillStyle = '#fff';
                const flashSize = 15 + Math.random() * 15;
                ctx.fillRect(s.x - flashSize / 2, s.y - flashSize / 2, flashSize, flashSize);

                s.life--;
            }
        });

        this.strikes = this.strikes.filter(s => s.life > 0);
        ctx.restore();
    }
}

class AegisOverloadEffect extends BombEffect {
    constructor(game) {
        super(game);
        this.duration = 90;
        this.maxRadius = this.game.width * 0.8;
    }
    update() {
        super.update();
        if (this.timer >= this.duration) this.active = false;

        // Continuous damage in expanding circle
        const radius = (this.timer / this.duration) * this.maxRadius;
        const radiusInner = radius - 50;
        const radiusInnerSq = radiusInner * radiusInner;
        const radiusOuterSq = radius * radius;

        this.game.enemies.forEach(e => {
            const dx = e.x - this.game.player.x, dy = e.y - this.game.player.y;
            const distSq = dx * dx + dy * dy;
            if (distSq <= radiusOuterSq && distSq >= radiusInnerSq) {
                e.lives -= 2;
                e.hitFlash = 2;
                // No direct deletion.
            }
        });
    }
    draw(ctx) {
        const radius = (this.timer / this.duration) * this.maxRadius;
        ctx.save();
        ctx.strokeStyle = `rgba(0, 255, 255, ${1 - this.timer / this.duration})`;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(this.game.player.x + this.game.player.width / 2, this.game.player.y + this.game.player.height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = 0.2 * (1 - this.timer / this.duration);
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(this.game.player.x + this.game.player.width / 2, this.game.player.y + this.game.player.height / 2, radius - 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class OmnislashEffect extends BombEffect {
    constructor(game) {
        super(game);
        this.duration = 60;
        this.slashes = [];
        // Reduced slash count for performance
        for (let i = 0; i < 20; i++) {
            this.slashes.push({
                x: Math.random() * game.width,
                y: Math.random() * game.height,
                angle: Math.random() * Math.PI,
                delay: Math.floor(Math.random() * 20),
                life: 12
            });
        }
    }
    update() {
        super.update();
        if (this.timer >= this.duration) this.active = false;
    }
    draw(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, this.game.width, this.game.height);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        this.slashes.forEach(s => {
            if (this.timer > s.delay && this.timer < s.delay + s.life) {
                const progress = (this.timer - s.delay) / s.life;
                const alpha = 1 - Math.abs(progress - 0.5) * 2;

                ctx.strokeStyle = `rgba(255, 80, 50, ${alpha})`;
                ctx.lineWidth = 3;

                const len = 180 * alpha;
                ctx.beginPath();
                ctx.moveTo(s.x - Math.cos(s.angle) * len, s.y - Math.sin(s.angle) * len);
                ctx.lineTo(s.x + Math.cos(s.angle) * len, s.y + Math.sin(s.angle) * len);
                ctx.stroke();
            }
        });
        ctx.restore();
    }
}

class HyperionBeamEffect extends BombEffect {
    constructor(game) {
        super(game);
        this.duration = 180; // 3 seconds
        this.height = 300;
    }
    update() {
        super.update();
        if (this.timer >= this.duration) this.active = false;

        // Continuous damage in beam area
        const py = this.game.player.y + this.game.player.height / 2;
        this.game.enemies.forEach(e => {
            if (e.y + e.height > py - this.height / 2 && e.y < py + this.height / 2 && e.x > this.game.player.x) {
                e.lives -= 3; // High dps
                e.hitFlash = 2;
                // No direct deletion.
            }
        });
    }
    draw(ctx) {
        const py = this.game.player.y + this.game.player.height / 2;
        const px = this.game.player.x + this.game.player.width;

        ctx.save();
        // Core
        ctx.fillStyle = 'rgba(200, 255, 255, 0.8)';
        ctx.fillRect(px, py - this.height / 4, this.game.width - px, this.height / 2);

        // Outer glow
        ctx.fillStyle = 'rgba(0, 100, 255, 0.2)';
        ctx.fillRect(px, py - this.height / 2, this.game.width - px, this.height);

        // Pulsing lines
        const offset = (this.timer * 30) % 200;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(px + offset, py - 5, 100, 10);
        ctx.fillRect(px + ((offset + 100) % 200), py - 2, 80, 4);

        ctx.restore();
    }
}
