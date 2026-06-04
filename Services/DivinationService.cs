using MeiHuaYiShu.Models;

namespace MeiHuaYiShu.Services;

public class DivinationService
{
    private static readonly Random Rng = new();

    public DivinationResult PerformDivination()
    {
        // 上卦：擲3顆異數骰（每顆1或2）
        int u1 = Rng.Next(1, 3); // 1 or 2
        int u2 = Rng.Next(1, 3);
        int u3 = Rng.Next(1, 3);

        // 下卦：擲3顆異數骰
        int l1 = Rng.Next(1, 3);
        int l2 = Rng.Next(1, 3);
        int l3 = Rng.Next(1, 3);

        // 動爻：擲1顆六面骰
        int movingLine = Rng.Next(1, 7);

        // 1=陽(1), 2=陰(0)，由下往上：底爻=dice1, 中爻=dice2, 上爻=dice3
        int[] upperLines = [ToYinYang(u1), ToYinYang(u2), ToYinYang(u3)];
        int[] lowerLines = [ToYinYang(l1), ToYinYang(l2), ToYinYang(l3)];

        int upperIndex = LinesToTrigram(upperLines);
        int lowerIndex = LinesToTrigram(lowerLines);

        var upper = IChingService.GetTrigram(upperIndex)!;
        var lower = IChingService.GetTrigram(lowerIndex)!;
        var original = IChingService.GetHexagram(upperIndex, lowerIndex)!;

        // 翻轉動爻
        int[] allLines = [.. lowerLines, .. upperLines];
        int lineIndex = movingLine - 1;
        allLines[lineIndex] = allLines[lineIndex] == 1 ? 0 : 1;

        int changedLowerIdx = LinesToTrigram(allLines[0..3]);
        int changedUpperIdx = LinesToTrigram(allLines[3..6]);

        var changed = IChingService.GetHexagram(changedUpperIdx, changedLowerIdx);

        return new DivinationResult
        {
            UpperDice = [u1, u2, u3],
            LowerDice = [l1, l2, l3],
            MovingLineDice = movingLine,
            UpperIndex = upperIndex,
            LowerIndex = lowerIndex,
            MovingLine = movingLine,
            Original = original,
            Changed = changed,
            UpperTrigramInfo = upper,
            LowerTrigramInfo = lower
        };
    }

    /// <summary>
    /// 1=陽(1), 2=陰(0)
    /// </summary>
    private static int ToYinYang(int diceValue)
    {
        return diceValue == 1 ? 1 : 0;
    }

    /// <summary>
    /// 三爻轉卦號 [底, 中, 上] → 1~8
    /// </summary>
    private static int LinesToTrigram(int[] lines)
    {
        int[][] trigramMap =
        [
            [1, 1, 1], // 1 乾
            [0, 1, 1], // 2 兌
            [1, 0, 1], // 3 離
            [0, 0, 1], // 4 震
            [1, 1, 0], // 5 巽
            [0, 1, 0], // 6 坎
            [1, 0, 0], // 7 艮
            [0, 0, 0], // 8 坤
        ];

        for (int i = 0; i < trigramMap.Length; i++)
        {
            if (trigramMap[i][0] == lines[0] &&
                trigramMap[i][1] == lines[1] &&
                trigramMap[i][2] == lines[2])
            {
                return i + 1;
            }
        }
        return 1;
    }
}
