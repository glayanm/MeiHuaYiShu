namespace MeiHuaYiShu.Models;

public class TrigramInfo
{
    public int Number { get; set; }
    public string Name { get; set; } = "";
    public string Nature { get; set; } = "";
    public string Element { get; set; } = "";
    public int[] Lines { get; set; } = [];
}

public class HexagramInfo
{
    public int Number { get; set; }
    public string Name { get; set; } = "";
    public string Symbol { get; set; } = "";
    public string Description { get; set; } = "";
    public string PlainExplanation { get; set; } = "";
    public string ClassicText { get; set; } = "";
    public string Advice { get; set; } = "";
    public string Fortune { get; set; } = "";
    public int UpperTrigram { get; set; }
    public int LowerTrigram { get; set; }
}

public class DivinationResult
{
    public int[] UpperDice { get; set; } = [];
    public int[] LowerDice { get; set; } = [];
    public int MovingLineDice { get; set; }
    public int UpperIndex { get; set; }
    public int LowerIndex { get; set; }
    public int MovingLine { get; set; }
    public HexagramInfo Original { get; set; } = new();
    public HexagramInfo? Changed { get; set; }
    public TrigramInfo UpperTrigramInfo { get; set; } = new();
    public TrigramInfo LowerTrigramInfo { get; set; } = new();
}
