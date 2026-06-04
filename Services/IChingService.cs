using MeiHuaYiShu.Models;

namespace MeiHuaYiShu.Services;

public class IChingService
{
    private static readonly Dictionary<int, TrigramInfo> Trigrams = new()
    {
        [1] = new() { Number = 1, Name = "乾", Nature = "天", Element = "金", Lines = [1, 1, 1] },
        [2] = new() { Number = 2, Name = "兌", Nature = "澤", Element = "金", Lines = [0, 1, 1] },
        [3] = new() { Number = 3, Name = "離", Nature = "火", Element = "火", Lines = [1, 0, 1] },
        [4] = new() { Number = 4, Name = "震", Nature = "雷", Element = "木", Lines = [0, 0, 1] },
        [5] = new() { Number = 5, Name = "巽", Nature = "風", Element = "木", Lines = [1, 1, 0] },
        [6] = new() { Number = 6, Name = "坎", Nature = "水", Element = "水", Lines = [0, 1, 0] },
        [7] = new() { Number = 7, Name = "艮", Nature = "山", Element = "土", Lines = [1, 0, 0] },
        [8] = new() { Number = 8, Name = "坤", Nature = "地", Element = "土", Lines = [0, 0, 0] },
    };

    private static readonly Dictionary<(int upper, int lower), HexagramInfo> Hexagrams = InitHexagrams();

    private static Dictionary<(int, int), HexagramInfo> InitHexagrams()
    {
        var h = new Dictionary<(int, int), HexagramInfo>();

        h[(1, 1)] = new HexagramInfo { Number = 1, Name = "乾為天", Symbol = "☰☰", UpperTrigram = 1, LowerTrigram = 1,
            Description = "乾卦，象徵天，剛健中正，萬物之始。",
            PlainExplanation = "這是一個充滿力量與創造力的時刻。你目前的狀態如同天空般遼闊無限，擁有強大的行動力與領導能力。現在適合積極進取，大膽地去追求你的目標。但要注意保持謙遜，過於剛強反而容易折斷。",
            ClassicText = "乾：元亨利貞。《象》曰：天行健，君子以自強不息。",
            Advice = "積極行動，保持剛健中正的態度，但要懂得適時收斂。",
            Fortune = "大吉" };

        h[(2, 1)] = new HexagramInfo { Number = 43, Name = "澤天夬", Symbol = "☱☰", UpperTrigram = 2, LowerTrigram = 1,
            Description = "夬卦，澤水上升於天，決斷之象。",
            PlainExplanation = "現在是做出重大決定的時候了。你面前有需要果斷處理的事情，猶豫不決只會讓問題惡化。相信自己的判斷，勇敢地做出選擇。但決斷時要光明磊落，不可暗中行事。",
            ClassicText = "夬：揚于王庭，孚號有厲。告自邑，不利即戎。利有攸往。",
            Advice = "果斷決策，光明正大地處理問題，避免使用強硬手段。",
            Fortune = "吉" };

        h[(3, 1)] = new HexagramInfo { Number = 14, Name = "火天大有", Symbol = "☲☰", UpperTrigram = 3, LowerTrigram = 1,
            Description = "大有卦，火在天上，光明普照，豐盛之象。",
            PlainExplanation = "恭喜！你正處於一個豐收和成功的時期。你的努力終於得到了回報，各方面都有很好的發展。要善用這段時期的資源和影響力，同時保持謙虛和感恩的心。",
            ClassicText = "大有：元亨。《象》曰：火在天上，大有。君子以遏惡揚善，順天休命。",
            Advice = "享受成功的果實，但要保持謙遜，善用資源幫助他人。",
            Fortune = "大吉" };

        h[(4, 1)] = new HexagramInfo { Number = 34, Name = "雷天大壯", Symbol = "☳☰", UpperTrigram = 4, LowerTrigram = 1,
            Description = "大壯卦，雷在天上，聲威赫赫，壯盛之象。",
            PlainExplanation = "你現在充滿了力量和能量，正是大展身手的好時機。但要記住，真正的強大不僅在於力量，更在於知道何時使用力量。不要因為一時的強勢而衝動行事。",
            ClassicText = "大壯：利貞。《象》曰：雷在天上，大壯。君子以非禮弗履。",
            Advice = "善用你的力量，但要遵守規則，不可恃強凌弱。",
            Fortune = "吉" };

        h[(5, 1)] = new HexagramInfo { Number = 9, Name = "風天小畜", Symbol = "☴☰", UpperTrigram = 5, LowerTrigram = 1,
            Description = "小畜卦，風行天上，密雲不雨，小有蓄積。",
            PlainExplanation = "目前的情況是積蓄力量的階段。雖然還不能大展宏圖，但這是一個很好的準備時期。耐心地累積資源和能力，等待最佳時機的到來。不要急於求成。",
            ClassicText = "小畜：亨。密雲不雨，自我西郊。",
            Advice = "耐心蓄積，不要急躁，等待時機成熟再行動。",
            Fortune = "平" };

        h[(6, 1)] = new HexagramInfo { Number = 5, Name = "水天需", Symbol = "☵☰", UpperTrigram = 6, LowerTrigram = 1,
            Description = "需卦，雲上於天，等待之象。",
            PlainExplanation = "現在需要耐心等待。你想要的事情會成功，但不是現在。就像農夫播種後需要等待作物成長一樣，你需要給事情發展的時間。在等待的同時，做好充分的準備。",
            ClassicText = "需：有孚，光亨，貞吉。利涉大川。",
            Advice = "耐心等待，做好準備，時機到來時果斷行動。",
            Fortune = "吉" };

        h[(7, 1)] = new HexagramInfo { Number = 26, Name = "山天大畜", Symbol = "☶☰", UpperTrigram = 7, LowerTrigram = 1,
            Description = "大畜卦，天在山中，大有蓄積之象。",
            PlainExplanation = "你已經累積了豐富的資源和能力，現在是一個蓄勢待發的時期。你的實力雄厚，但要學會在適當的時候展現。這是一個適合學習、修養和準備的時期。",
            ClassicText = "大畜：利貞，不家食吉。利涉大川。",
            Advice = "善用蓄積的實力，適合出行、學習、發展事業。",
            Fortune = "大吉" };

        h[(8, 1)] = new HexagramInfo { Number = 11, Name = "地天泰", Symbol = "☷☰", UpperTrigram = 8, LowerTrigram = 1,
            Description = "泰卦，天地交泰，萬物通暢之象。",
            PlainExplanation = "這是極為吉祥的時刻！天地和諧，萬事通順。你的人際關係、事業、財運都會有很好的發展。把握這段順遂的時期，積極進取，同時保持與周圍人的良好關係。",
            ClassicText = "泰：小往大來，吉亨。《象》曰：天地交泰，后以財成天地之道。",
            Advice = "大吉大利，積極行動，廣結善緣。",
            Fortune = "大吉" };

        h[(1, 2)] = new HexagramInfo { Number = 10, Name = "天澤履", Symbol = "☰☱", UpperTrigram = 1, LowerTrigram = 2,
            Description = "履卦，如履虎尾，小心謹慎之象。",
            PlainExplanation = "你正處於一個需要格外小心的環境中。周圍可能有潛在的危險或挑戰，但只要你行事端正、謹慎小心，就能化險為夷。記得以禮待人，以柔克剛。",
            ClassicText = "履：履虎尾，不咥人，亨。",
            Advice = "小心謹慎，以禮待人，處事圓融。",
            Fortune = "平" };

        h[(2, 2)] = new HexagramInfo { Number = 58, Name = "兌為澤", Symbol = "☱☱", UpperTrigram = 2, LowerTrigram = 2,
            Description = "兌卦，澤水相連，喜悅之象。",
            PlainExplanation = "這是一個充滿喜悅和和諧的時期。你的人際關係很好，與周圍的人相處融洽。適合社交、聚會、合作。保持開朗的心情，你的正能量會感染身邊的人。",
            ClassicText = "兌：亨，利貞。《象》曰：麗澤，兌。君子以朋友講習。",
            Advice = "保持喜悅的心情，多與人交流，適合合作。",
            Fortune = "吉" };

        h[(3, 2)] = new HexagramInfo { Number = 38, Name = "火澤睽", Symbol = "☲☱", UpperTrigram = 3, LowerTrigram = 2,
            Description = "睽卦，火焰向上澤水向下，相違之象。",
            PlainExplanation = "目前可能面臨一些分歧或矛盾。你和某些人的想法不太一致，或者事情的發展與預期不同。但這不代表完全不好，在差異中往往能找到互補的機會。",
            ClassicText = "睽：小事吉。《象》曰：上火下澤，睽。君子以同而異。",
            Advice = "求同存異，在矛盾中尋找平衡點。",
            Fortune = "平" };

        h[(4, 2)] = new HexagramInfo { Number = 54, Name = "雷澤歸妹", Symbol = "☳☱", UpperTrigram = 4, LowerTrigram = 2,
            Description = "歸妹卦，雷動澤悅，婚嫁之象。",
            PlainExplanation = "這個卦象暗示著一段新的關係或合作的開始。但要注意，這段關係可能不是最完美的，需要雙方共同努力經營。不要期望太高，腳踏實地地經營每一段關係。",
            ClassicText = "歸妹：征凶，无攸利。",
            Advice = "謹慎處理新的關係和合作，不要衝動。",
            Fortune = "平" };

        h[(5, 2)] = new HexagramInfo { Number = 61, Name = "風澤中孚", Symbol = "☴☱", UpperTrigram = 5, LowerTrigram = 2,
            Description = "中孚卦，風行澤上，誠信之象。",
            PlainExplanation = "這是一個強調誠信的時期。你的真誠和信用是你最大的資產。以誠待人，言出必行，你會贏得他人的信任和支持。這是一個適合做出承諾和建立信任的時期。",
            ClassicText = "中孚：豚魚吉。利涉大川，利貞。",
            Advice = "以誠待人，信守承諾，真誠是最好的策略。",
            Fortune = "吉" };

        h[(6, 2)] = new HexagramInfo { Number = 60, Name = "水澤節", Symbol = "☵☱", UpperTrigram = 6, LowerTrigram = 2,
            Description = "節卦，水在澤上，節制之象。",
            PlainExplanation = "現在是需要節制和自律的時候。無論是金錢、時間還是精力，都需要合理分配。過度的放縱或過度的節約都不好，找到適中的平衡點才是關鍵。",
            ClassicText = "節：亨。苦節不可貞。",
            Advice = "適度節制，凡事不要過度，中庸之道最重要。",
            Fortune = "平" };

        h[(7, 2)] = new HexagramInfo { Number = 41, Name = "山澤損", Symbol = "☶☱", UpperTrigram = 7, LowerTrigram = 2,
            Description = "損卦，山下有澤，減損之象。",
            PlainExplanation = "這個時期可能需要你做出一些犧牲或讓步。看似是損失，但實際上可能是為了更大的收穫。學會取捨，有時候退一步反而能海闊天空。",
            ClassicText = "損：有孚，元吉，无咎。可貞，利有攸往。",
            Advice = "適當的讓步和犧牲，是為了更好的發展。",
            Fortune = "平" };

        h[(8, 2)] = new HexagramInfo { Number = 19, Name = "地澤臨", Symbol = "☷☱", UpperTrigram = 8, LowerTrigram = 2,
            Description = "臨卦，地在澤上，親臨之象。",
            PlainExplanation = "這是一個充滿希望和機遇的時期。好的事情正在接近你，要以開放的心態去迎接。這也是適合領導和指導他人的時期，你的影響力正在擴大。",
            ClassicText = "臨：元亨，利貞。至于八月有凶。",
            Advice = "把握機遇，積極行動，但要注意盛極必衰。",
            Fortune = "吉" };

        h[(1, 3)] = new HexagramInfo { Number = 13, Name = "天火同人", Symbol = "☰☲", UpperTrigram = 1, LowerTrigram = 3,
            Description = "同人卦，天與火同，志同道合之象。",
            PlainExplanation = "這是一個適合與他人合作和社交的時期。你會遇到志同道合的人，一起為共同的目標努力。團隊合作會比單打獨鬥更有效。保持開放和包容的心態。",
            ClassicText = "同人于野，亨。利涉大川，利君子貞。",
            Advice = "團結合作，廣結善緣，共同進退。",
            Fortune = "吉" };

        h[(2, 3)] = new HexagramInfo { Number = 49, Name = "澤火革", Symbol = "☱☲", UpperTrigram = 2, LowerTrigram = 3,
            Description = "革卦，澤中有火，變革之象。",
            PlainExplanation = "變革的時刻已經到來！舊的模式已經不再適用，現在是做出改變的時候了。雖然改變可能讓人不安，但這是成長的必經之路。勇敢地擁抱變化。",
            ClassicText = "革：已日乃孚，元亨利貞，悔亡。",
            Advice = "順應變革，勇於改變，但要循序漸進。",
            Fortune = "吉" };

        h[(3, 3)] = new HexagramInfo { Number = 30, Name = "離為火", Symbol = "☲☲", UpperTrigram = 3, LowerTrigram = 3,
            Description = "離卦，光明相繼，依附之象。",
            PlainExplanation = "你現在處於一個光明和清晰的狀態。思路清晰，判斷力強。但要注意，光明需要有所依附才能持續。找到你的支持系統和依靠，不要獨自承擔一切。",
            ClassicText = "離：利貞，亨。畜牝牛，吉。",
            Advice = "保持光明正大的態度，找到可以依附和支持的力量。",
            Fortune = "吉" };

        h[(4, 3)] = new HexagramInfo { Number = 55, Name = "雷火豐", Symbol = "☳☲", UpperTrigram = 4, LowerTrigram = 3,
            Description = "豐卦，雷電皆至，豐盛之象。",
            PlainExplanation = "你正處於人生的豐盛時期！各方面都有很好的發展，就像正午的太陽一樣光芒四射。但要記住，盛極必衰，在高峰時期更要保持謙遜和警覺。",
            ClassicText = "豐：亨。王假之，勿憂，宜日中。",
            Advice = "享受豐盛，但要居安思危，保持謙遜。",
            Fortune = "大吉" };

        h[(5, 3)] = new HexagramInfo { Number = 37, Name = "風火家人", Symbol = "☴☲", UpperTrigram = 5, LowerTrigram = 3,
            Description = "家人卦，風自火出，家庭之象。",
            PlainExplanation = "家庭和人際關係是現在的重心。花時間陪伴家人，處理好家庭事務。一個和諧的家庭環境會給你帶來力量和支持。這也是適合處理團隊內部事務的時期。",
            ClassicText = "家人：利女貞。",
            Advice = "重視家庭和人際關係，營造和諧的氛圍。",
            Fortune = "吉" };

        h[(6, 3)] = new HexagramInfo { Number = 63, Name = "水火既濟", Symbol = "☵☲", UpperTrigram = 6, LowerTrigram = 3,
            Description = "既濟卦，水在火上，事已成就之象。",
            PlainExplanation = "恭喜！你之前的努力已經取得了成果。事情已經達到了一個完成的狀態。但要記住，完成不代表結束，要繼續保持警惕，防止問題再次出現。",
            ClassicText = "既濟：亨小，利貞。初吉終亂。",
            Advice = "享受成果，但要居安思危，不可鬆懈。",
            Fortune = "吉" };

        h[(7, 3)] = new HexagramInfo { Number = 22, Name = "山火賁", Symbol = "☶☲", UpperTrigram = 7, LowerTrigram = 3,
            Description = "賁卦，山下有火，文飾之象。",
            PlainExplanation = "現在是注重外在形象和內在修養的時候。適當地修飾和包裝自己，但不要只注重外表而忽略了內在的實質。真正的美是內外兼修的。",
            ClassicText = "賁：亨。小利有攸往。",
            Advice = "注重修養和形象，但要表裡如一。",
            Fortune = "平" };

        h[(8, 3)] = new HexagramInfo { Number = 36, Name = "地火明夷", Symbol = "☷☲", UpperTrigram = 8, LowerTrigram = 3,
            Description = "明夷卦，火入地中，光明受傷之象。",
            PlainExplanation = "你可能正在經歷一段困難或黑暗的時期。光明暫時被遮蔽，但這不代表永遠。在這段時期，保持低調，保護好自己，等待時機的到來。黎明前的黑暗終將過去。",
            ClassicText = "明夷：利艱貞。",
            Advice = "韜光養晦，保持堅韌，等待黑暗過去。",
            Fortune = "凶" };

        h[(1, 4)] = new HexagramInfo { Number = 25, Name = "天雷无妄", Symbol = "☰☳", UpperTrigram = 1, LowerTrigram = 4,
            Description = "无妄卦，天下雷行，无妄之象。",
            PlainExplanation = "這是一個強調自然和真實的時期。不要投機取巧，不要妄想不勞而獲。腳踏實地，順其自然地去做事，反而能獲得意想不到的好結果。",
            ClassicText = "无妄：元亨利貞。其匪正有眚，不利有攸往。",
            Advice = "順其自然，腳踏實地，不要有非分之想。",
            Fortune = "吉" };

        h[(2, 4)] = new HexagramInfo { Number = 17, Name = "澤雷隨", Symbol = "☱☳", UpperTrigram = 2, LowerTrigram = 4,
            Description = "隨卦，澤中有雷，隨從之象。",
            PlainExplanation = "現在是適合順應時勢、隨機應變的時候。不要過於固執己見，學會靈活變通。跟隨正確的方向和領袖，你會發現事情變得順利許多。",
            ClassicText = "隨：元亨利貞，无咎。",
            Advice = "隨機應變，順應時勢，不要太固執。",
            Fortune = "吉" };

        h[(3, 4)] = new HexagramInfo { Number = 21, Name = "火雷噬嗑", Symbol = "☲☳", UpperTrigram = 3, LowerTrigram = 4,
            Description = "噬嗑卦，雷電交合，決斷之象。",
            PlainExplanation = "你面前有需要解決的障礙或問題。就像咬碎食物一樣，你需要果斷地處理這些問題。不要逃避，勇敢地面對困難，問題會得到解決。",
            ClassicText = "噬嗑：亨。利用獄。",
            Advice = "果斷解決問題，不要拖延，依法行事。",
            Fortune = "平" };

        h[(4, 4)] = new HexagramInfo { Number = 51, Name = "震為雷", Symbol = "☳☳", UpperTrigram = 4, LowerTrigram = 4,
            Description = "震卦，重雷震動，震驚之象。",
            PlainExplanation = "可能會有意想不到的事情發生，讓你感到震驚或不安。但這也是一個覺醒的契機。保持冷靜，在震驚中找到新的方向。經歷風雨後，你會變得更加堅強。",
            ClassicText = "震：亨。震來虩虩，笑言啞啞。震驚百里，不喪匕鬯。",
            Advice = "保持冷靜，從震驚中學習，危機也是轉機。",
            Fortune = "平" };

        h[(5, 4)] = new HexagramInfo { Number = 42, Name = "風雷益", Symbol = "☴☳", UpperTrigram = 5, LowerTrigram = 4,
            Description = "益卦，風雷相益，增益之象。",
            PlainExplanation = "這是一個充滿正面能量的時期！你的努力會得到加倍的回報。適合投資自己、學習新技能、拓展事業。幫助他人也會給你帶來好運。",
            ClassicText = "益：利有攸往，利涉大川。",
            Advice = "積極進取，幫助他人，你的付出會有豐厚回報。",
            Fortune = "大吉" };

        h[(6, 4)] = new HexagramInfo { Number = 3, Name = "水雷屯", Symbol = "☵☳", UpperTrigram = 6, LowerTrigram = 4,
            Description = "屯卦，雷雨交加，草創之象。",
            PlainExplanation = "你正處於事業或計劃的初始階段，就像春天的種子剛剛發芽。雖然困難重重，但這一切都是暫時的。堅持下去，尋求幫助，你的努力終將開花結果。",
            ClassicText = "屯：元亨利貞，勿用有攸往，利建侯。",
            Advice = "堅持不懈，尋求幫助，困難是暫時的。",
            Fortune = "平" };

        h[(7, 4)] = new HexagramInfo { Number = 27, Name = "山雷頤", Symbol = "☶☳", UpperTrigram = 7, LowerTrigram = 4,
            Description = "頤卦，山下有雷，養身之象。",
            PlainExplanation = "現在是注重自我照顧和修養的時候。注意飲食健康、作息規律，養好身體。同時也要注意精神上的滋養，多讀書、多思考。只有身心都健康，才能更好地前進。",
            ClassicText = "頤：貞吉。觀頤，自求口實。",
            Advice = "注重養生，合理飲食，滋養身心。",
            Fortune = "吉" };

        h[(8, 4)] = new HexagramInfo { Number = 24, Name = "地雷復", Symbol = "☷☳", UpperTrigram = 8, LowerTrigram = 4,
            Description = "復卦，地中有雷，復返之象。",
            PlainExplanation = "好消息！你之前經歷的困難即將結束，新的開始就在眼前。就像冬去春來一樣，一切都在慢慢好轉。把握這個復甦的時機，重新出發。",
            ClassicText = "復：亨。出入无疾，朋來无咎。反復其道，七日來復。利有攸往。",
            Advice = "把握復甦的時機，重新開始，一切會越來越好。",
            Fortune = "吉" };

        h[(1, 5)] = new HexagramInfo { Number = 44, Name = "天風姤", Symbol = "☰☴", UpperTrigram = 1, LowerTrigram = 5,
            Description = "姤卦，天下有風，相遇之象。",
            PlainExplanation = "你可能會遇到一些意想不到的機會或人。這些相遇可能會帶來變化，要保持警覺。但也要小心，不是所有的機會都是好的，學會分辨和選擇。",
            ClassicText = "姤：女壯，勿用取女。",
            Advice = "把握機會，但要謹慎選擇，不可輕率。",
            Fortune = "平" };

        h[(2, 5)] = new HexagramInfo { Number = 28, Name = "澤風大過", Symbol = "☱☴", UpperTrigram = 2, LowerTrigram = 5,
            Description = "大過卦，澤水滅木，大有過失之象。",
            PlainExplanation = "你可能正面臨一些超出常規的壓力或挑戰。情況可能有些極端，需要特別的處理方式。不要用常規的方法來解決非常問題，要勇於創新和突破。",
            ClassicText = "大過：棟橈。利有攸往，亨。",
            Advice = "勇於突破常規，用非常手段解決非常問題。",
            Fortune = "凶" };

        h[(3, 5)] = new HexagramInfo { Number = 50, Name = "火風鼎", Symbol = "☲☴", UpperTrigram = 3, LowerTrigram = 5,
            Description = "鼎卦，木上有火，鼎新之象。",
            PlainExplanation = "這是一個適合創新和變革的時期。就像用鼎烹飪食物一樣，把各種元素融合在一起，創造出新的事物。你的創造力很強，適合開始新的計劃或項目。",
            ClassicText = "鼎：元吉，亨。",
            Advice = "大膽創新，適合開始新計劃，迎接新事物。",
            Fortune = "大吉" };

        h[(4, 5)] = new HexagramInfo { Number = 32, Name = "雷風恒", Symbol = "☳☴", UpperTrigram = 4, LowerTrigram = 5,
            Description = "恒卦，雷風相與，恒久之象。",
            PlainExplanation = "這個時期強調的是持久和堅持。你正在做的事情需要長期的努力才能看到成果。不要半途而廢，保持耐心和毅力。恒心是成功的關鍵。",
            ClassicText = "恒：亨，无咎，利貞。利有攸往。",
            Advice = "堅持不懈，持之以恆，成功需要時間。",
            Fortune = "吉" };

        h[(5, 5)] = new HexagramInfo { Number = 57, Name = "巽為風", Symbol = "☴☴", UpperTrigram = 5, LowerTrigram = 5,
            Description = "巽卦，風行無阻，順從之象。",
            PlainExplanation = "現在適合以柔克剛，用溫和的方式來處理事情。像風一樣無處不在但又不具攻擊性。學會順應環境，靈活變通，你會發現很多事情自然而然地就解決了。",
            ClassicText = "巽：小亨，利有攸往，利見大人。",
            Advice = "以柔克剛，順應環境，靈活變通。",
            Fortune = "吉" };

        h[(6, 5)] = new HexagramInfo { Number = 48, Name = "水風井", Symbol = "☵☴", UpperTrigram = 6, LowerTrigram = 5,
            Description = "井卦，木上有水，養人之象。",
            PlainExplanation = "這個時期提醒你要注重根本和源泉。就像井水滋養萬物一樣，找到你的知識和能力的源泉，不斷地汲取和學習。同時也要記得回饋和幫助他人。",
            ClassicText = "井：改邑不改井，无喪无得。往來井井。",
            Advice = "注重根本，持續學習，也要幫助他人。",
            Fortune = "吉" };

        h[(7, 5)] = new HexagramInfo { Number = 18, Name = "山風蠱", Symbol = "☶☴", UpperTrigram = 7, LowerTrigram = 5,
            Description = "蠱卦，山下有風，整飭之象。",
            PlainExplanation = "有些問題需要你去處理和修復。可能是之前的疏忽或錯誤現在開始顯現。不要害怕面對這些問題，積極地去解決它們，這是一個清理和整頓的好時機。",
            ClassicText = "蠱：元亨，利涉大川。先甲三日，後甲三日。",
            Advice = "積極修復問題，整頓秩序，不要逃避。",
            Fortune = "平" };

        h[(8, 5)] = new HexagramInfo { Number = 46, Name = "地風升", Symbol = "☷☴", UpperTrigram = 8, LowerTrigram = 5,
            Description = "升卦，地中生木，上升之象。",
            PlainExplanation = "你的事業或生活正在穩步上升！就像樹木從地面慢慢長高一樣，你的發展是穩定而持續的。保持這個勢頭，繼續努力，你會達到新的高度。",
            ClassicText = "升：元亨。用見大人，勿恤，南征吉。",
            Advice = "穩步前進，保持上升的勢頭，適合求見貴人。",
            Fortune = "大吉" };

        h[(1, 6)] = new HexagramInfo { Number = 6, Name = "天水訟", Symbol = "☰☵", UpperTrigram = 1, LowerTrigram = 6,
            Description = "訟卦，天與水違行，爭訟之象。",
            PlainExplanation = "可能會有一些爭執或糾紛出現。如果可能的話，盡量通過溝通和協商來解決問題，避免走上法律途徑。有時候退讓一步，反而能更快地解決問題。",
            ClassicText = "訟：有孚窒惕，中吉，終凶。利見大人，不利涉大川。",
            Advice = "以和為貴，通過溝通解決問題，避免爭訟。",
            Fortune = "凶" };

        h[(2, 6)] = new HexagramInfo { Number = 47, Name = "澤水困", Symbol = "☱☵", UpperTrigram = 2, LowerTrigram = 6,
            Description = "困卦，澤中无水，困窮之象。",
            PlainExplanation = "你可能會感覺資源不足或受到限制。這是一個考驗你意志力的時期。雖然困難，但這也是成長的機會。保持樂觀，發揮創意，你會找到突破困境的方法。",
            ClassicText = "困：亨，貞，大人吉，无咎。有言不信。",
            Advice = "保持樂觀，發揮創意，困境是暫時的。",
            Fortune = "凶" };

        h[(3, 6)] = new HexagramInfo { Number = 64, Name = "火水未濟", Symbol = "☲☵", UpperTrigram = 3, LowerTrigram = 6,
            Description = "未濟卦，火在水上，事未成之象。",
            PlainExplanation = "事情還沒有完成，還需要繼續努力。不要急於求成，也不要灰心喪氣。這只是一個過渡階段，只要你堅持不懈，最終會達到目標。",
            ClassicText = "未濟：亨。小狐汔濟，濡其尾，无攸利。",
            Advice = "繼續努力，不要放棄，成功就在前方。",
            Fortune = "平" };

        h[(4, 6)] = new HexagramInfo { Number = 40, Name = "雷水解", Symbol = "☳☵", UpperTrigram = 4, LowerTrigram = 6,
            Description = "解卦，雷雨作，解除之象。",
            PlainExplanation = "好消息！之前困擾你的問題即將得到解決。就像雷雨過後天空放晴一樣，一切都在好轉中。抓住這個機會，積極地處理遺留問題，輕裝上陣。",
            ClassicText = "解：利西南，无所往，其來復吉。有攸往，夙吉。",
            Advice = "把握解決問題的時機，輕裝上陣。",
            Fortune = "吉" };

        h[(5, 6)] = new HexagramInfo { Number = 59, Name = "風水渙", Symbol = "☴☵", UpperTrigram = 5, LowerTrigram = 6,
            Description = "渙卦，風行水上，渙散之象。",
            PlainExplanation = "現在可能面臨一些分散或流失的情況。可能是團隊不夠團結，或者注意力太過分散。需要重新凝聚力量，找到核心目標，集中精力去實現。",
            ClassicText = "渙：亨。王假有廟，利涉大川，利貞。",
            Advice = "重新凝聚力量，集中精力，避免分散。",
            Fortune = "平" };

        h[(6, 6)] = new HexagramInfo { Number = 29, Name = "坎為水", Symbol = "☵☵", UpperTrigram = 6, LowerTrigram = 6,
            Description = "坎卦，重水相疊，險陷之象。",
            PlainExplanation = "你可能正處於一個充滿挑戰和困難的時期。前方的路不太好走，但記住，水雖然柔軟卻能穿石。保持冷靜和堅韌，一步一步地走出困境。",
            ClassicText = "習坎：有孚，維心亨，行有尚。",
            Advice = "保持冷靜和堅韌，一步一步走出困境。",
            Fortune = "凶" };

        h[(7, 6)] = new HexagramInfo { Number = 4, Name = "山水蒙", Symbol = "☶☵", UpperTrigram = 7, LowerTrigram = 6,
            Description = "蒙卦，山下有泉，蒙昧之象。",
            PlainExplanation = "你可能對某些事情還不太了解或迷茫。這是一個學習和探索的時期。保持謙虛的學習態度，向有經驗的人請教。知識會為你照亮前路。",
            ClassicText = "蒙：亨。匪我求童蒙，童蒙求我。初筮告，再三瀆，瀆則不告。利貞。",
            Advice = "虛心學習，請教前輩，知識是最好的武器。",
            Fortune = "平" };

        h[(8, 6)] = new HexagramInfo { Number = 7, Name = "地水師", Symbol = "☷☵", UpperTrigram = 8, LowerTrigram = 6,
            Description = "師卦，地中有水，師旅之象。",
            PlainExplanation = "現在可能需要你發揮領導能力，帶領團隊應對挑戰。就像將軍帶領軍隊一樣，你需要有明確的計劃和策略。公平公正地對待每個人，你會贏得大家的支持。",
            ClassicText = "師：貞，丈人吉，无咎。",
            Advice = "發揮領導力，公平公正，制定明確計劃。",
            Fortune = "平" };

        h[(1, 7)] = new HexagramInfo { Number = 33, Name = "天山遁", Symbol = "☰☶", UpperTrigram = 1, LowerTrigram = 7,
            Description = "遁卦，天下有山，退避之象。",
            PlainExplanation = "現在可能是需要暫時退讓或避開的時候。不是所有的戰鬥都值得打，有時候策略性的撤退是明智之舉。保存實力，等待更好的時機再出擊。",
            ClassicText = "遁：亨，小利貞。",
            Advice = "策略性退讓，保存實力，等待時機。",
            Fortune = "平" };

        h[(2, 7)] = new HexagramInfo { Number = 31, Name = "澤山咸", Symbol = "☱☶", UpperTrigram = 2, LowerTrigram = 7,
            Description = "咸卦，山上有澤，感應之象。",
            PlainExplanation = "這是一個適合建立情感連結的時期。你的感受力很強，能敏銳地察覺到周圍人的情感。適合發展戀情、加深友誼，或者與合作夥伴建立更深的信任。",
            ClassicText = "咸：亨，利貞。取女吉。",
            Advice = "用心感受，建立真誠的情感連結。",
            Fortune = "吉" };

        h[(3, 7)] = new HexagramInfo { Number = 56, Name = "火山旅", Symbol = "☲☶", UpperTrigram = 3, LowerTrigram = 7,
            Description = "旅卦，山上有火，旅行之象。",
            PlainExplanation = "你可能處於一個不穩定或過渡的時期。就像旅行者一樣，你需要靈活應對各種情況。保持警覺，照顧好自己。這段經歷會給你帶來寶貴的見識和成長。",
            ClassicText = "旅：小亨，旅貞吉。",
            Advice = "保持靈活，照顧好自己，珍惜旅途中的經歷。",
            Fortune = "平" };

        h[(4, 7)] = new HexagramInfo { Number = 62, Name = "雷山小過", Symbol = "☳☶", UpperTrigram = 4, LowerTrigram = 7,
            Description = "小過卦，山上有雷，小有過越之象。",
            PlainExplanation = "這個時期要小心謹慎，不要過於冒進。小事可以做一些，但大事要三思而行。保持低調，腳踏實地。有時候，寧可做得少一些，也不要犯大錯。",
            ClassicText = "小過：亨，利貞。可小事，不可大事。飛鳥遺之音，不宜上宜下，大吉。",
            Advice = "小心謹慎，腳踏實地，不要好高騖遠。",
            Fortune = "平" };

        h[(5, 7)] = new HexagramInfo { Number = 53, Name = "風山漸", Symbol = "☴☶", UpperTrigram = 5, LowerTrigram = 7,
            Description = "漸卦，山上有木，漸進之象。",
            PlainExplanation = "你的發展是穩定而漸進的。不要急於求成，就像樹木慢慢長高一樣，你的成長需要時間。保持穩定的步伐，每一步都走得扎實，你會達到目標。",
            ClassicText = "漸：女歸吉，利貞。",
            Advice = "循序漸進，穩步發展，不要急躁。",
            Fortune = "吉" };

        h[(6, 7)] = new HexagramInfo { Number = 39, Name = "水山蹇", Symbol = "☵☶", UpperTrigram = 6, LowerTrigram = 7,
            Description = "蹇卦，山上有水，艱難之象。",
            PlainExplanation = "你可能正面臨一些困難和障礙。前進的道路不太順暢。這時候不要硬闖，要學會迂迴。向有經驗的人請教，尋找替代方案。困難終會過去。",
            ClassicText = "蹇：利西南，不利東北。利見大人，貞吉。",
            Advice = "尋求幫助，迂迴前進，不要硬闖。",
            Fortune = "凶" };

        h[(7, 7)] = new HexagramInfo { Number = 52, Name = "艮為山", Symbol = "☶☶", UpperTrigram = 7, LowerTrigram = 7,
            Description = "艮卦，山山相疊，止而不動之象。",
            PlainExplanation = "現在是一個需要停下來思考的時候。不要再盲目地向前衝，而是靜下心來，好好想想自己真正想要什麼。有時候，停下腳步也是一種前進。",
            ClassicText = "艮其背，不獲其身。行其庭，不見其人。无咎。",
            Advice = "停下來思考，靜心反省，不要盲目行動。",
            Fortune = "平" };

        h[(8, 7)] = new HexagramInfo { Number = 15, Name = "地山謙", Symbol = "☷☶", UpperTrigram = 8, LowerTrigram = 7,
            Description = "謙卦，地中有山，謙虛之象。",
            PlainExplanation = "這是一個強調謙遜美德的時期。你可能已經有了一些成就，但保持謙虛的態度會讓你贏得更多人的尊重和支持。謙虛不是軟弱，而是一種智慧。",
            ClassicText = "謙：亨，君子有終。",
            Advice = "保持謙遜，不驕不躁，你會得到更多支持。",
            Fortune = "吉" };

        h[(1, 8)] = new HexagramInfo { Number = 12, Name = "天地否", Symbol = "☰☷", UpperTrigram = 1, LowerTrigram = 8,
            Description = "否卦，天地不交，閉塞之象。",
            PlainExplanation = "目前的狀況可能不太理想，事情進展不順。就像天地不交一樣，溝通可能出現障礙。這是一個需要忍耐的時期。保持低調，等待否極泰來。",
            ClassicText = "否之匪人，不利君子貞。大往小來。",
            Advice = "保持忍耐，低調行事，等待轉機。",
            Fortune = "凶" };

        h[(2, 8)] = new HexagramInfo { Number = 45, Name = "澤地萃", Symbol = "☱☷", UpperTrigram = 2, LowerTrigram = 8,
            Description = "萃卦，澤上於地，聚集之象。",
            PlainExplanation = "這是一個適合聚集和團結的時期。你會發現周圍有很多志同道合的人。適合參加聚會、建立社群、團隊合作。團結力量大，一起努力會有更好的成果。",
            ClassicText = "萃：亨。王假有廟，利見大人，亨，利貞。用大牲吉，利有攸往。",
            Advice = "團結他人，集體行動，共同目標。",
            Fortune = "吉" };

        h[(3, 8)] = new HexagramInfo { Number = 35, Name = "火地晉", Symbol = "☲☷", UpperTrigram = 3, LowerTrigram = 8,
            Description = "晉卦，明出地上，進展之象。",
            PlainExplanation = "你的事業或生活正在穩步前進！就像太陽從地面升起一樣，你的前景一片光明。保持積極的態度，繼續努力，你會獲得更多的認可和成就。",
            ClassicText = "晉：康侯用錫馬蕃庶，晝日三接。",
            Advice = "積極進取，把握機會，前景光明。",
            Fortune = "大吉" };

        h[(4, 8)] = new HexagramInfo { Number = 16, Name = "雷地豫", Symbol = "☳☷", UpperTrigram = 4, LowerTrigram = 8,
            Description = "豫卦，雷出地奮，喜悅之象。",
            PlainExplanation = "這是一個充滿活力和喜悅的時期。事情進展順利，讓你感到愉快和滿足。適合享受生活，與親朋好友共度美好時光。但不要因為太過安逸而放鬆警惕。",
            ClassicText = "豫：利建侯行師。",
            Advice = "享受生活，但要保持警覺，不要過度放鬆。",
            Fortune = "吉" };

        h[(5, 8)] = new HexagramInfo { Number = 20, Name = "風地觀", Symbol = "☴☷", UpperTrigram = 5, LowerTrigram = 8,
            Description = "觀卦，風行地上，觀察之象。",
            PlainExplanation = "現在是一個觀察和思考的時期。不要急於行動，先好好觀察周圍的情況。通過觀察，你會發現很多之前忽略的細節。這是一個適合學習和反思的時候。",
            ClassicText = "觀：盥而不薦，有孚顒若。",
            Advice = "仔細觀察，深入思考，不要急於行動。",
            Fortune = "平" };

        h[(6, 8)] = new HexagramInfo { Number = 8, Name = "水地比", Symbol = "☵☷", UpperTrigram = 6, LowerTrigram = 8,
            Description = "比卦，水與地相親，親比之象。",
            PlainExplanation = "這是一個適合建立親密關係和合作的時期。與周圍的人建立良好的關係，互相支持。適合尋找合作夥伴、加入團隊。和諧的人際關係會給你帶來幫助。",
            ClassicText = "比：吉。原筮元永貞，无咎。不寧方來，後夫凶。",
            Advice = "建立良好的人際關係，尋求合作。",
            Fortune = "吉" };

        h[(7, 8)] = new HexagramInfo { Number = 23, Name = "山地剝", Symbol = "☶☷", UpperTrigram = 7, LowerTrigram = 8,
            Description = "剝卦，山附於地，剝落之象。",
            PlainExplanation = "你可能正在經歷一些損失或衰退。這是一個需要保護自己、保存實力的時期。不要做大的投資或冒險。等待時機好轉，現在最重要的是生存。",
            ClassicText = "剝：不利有攸往。",
            Advice = "保守行事，保存實力，等待時機好轉。",
            Fortune = "凶" };

        h[(8, 8)] = new HexagramInfo { Number = 2, Name = "坤為地", Symbol = "☷☷", UpperTrigram = 8, LowerTrigram = 8,
            Description = "坤卦，地勢坤厚，承載萬物之象。",
            PlainExplanation = "這是一個需要包容和承載的時期。像大地一樣，用寬廣的胸懷去接納一切。適合支持他人、服務團隊。你的溫柔和堅韌是你最大的力量。",
            ClassicText = "坤：元亨，利牝馬之貞。君子有攸往，先迷後得主。利西南得朋，東北喪朋。安貞吉。",
            Advice = "以柔克剛，包容萬物，支持他人。",
            Fortune = "吉" };

        return h;
    }

    public static TrigramInfo? GetTrigram(int number)
    {
        return Trigrams.GetValueOrDefault(number);
    }

    public static HexagramInfo? GetHexagram(int upper, int lower)
    {
        return Hexagrams.GetValueOrDefault((upper, lower));
    }

    public static int[] GetTrigramLines(int trigramNumber)
    {
        return Trigrams.TryGetValue(trigramNumber, out var t) ? t.Lines : [0, 0, 0];
    }
}
