# Trasovník (RouteMaker)

<p>
  <a href="README.md"><img alt="🇨🇿 Čeština" src="https://img.shields.io/badge/%F0%9F%87%A8%F0%9F%87%BF-%C4%8Ce%C5%A1tina-blue"></a>
  <a href="README_EN.md"><img alt="🇬🇧 English" src="https://img.shields.io/badge/%F0%9F%87%AC%F0%9F%87%A7-English-blue"></a>
</p>

Trasovník je webová aplikace pro přípravu tras v mapě, měření jejich délky a převýšení a export podkladů pro sdílení nebo tisk. Vznikl pro potřeby projektu [Cestou Vysočiny](https://www.stoky.cz/cestou-vysociny/a-1388) a koordinátorů cestovního ruchu v kraji Vysočina.

Aplikaci otevřete zde: https://trasovnik.mareska.xyz/

![Náhled](docs/images/preview.png)

## K čemu slouží

- Kreslení tras nad mapovými podklady Mapy.com.
- Kombinace úseků vedených po cestách a volných rovných úseků.
- Vyhledávání míst a rychlý přesun v mapě.
- Měření délky, odhadovaného času, stoupání, klesání a hodnot po jednotlivých úsecích.
- Uložení trasy do souboru GPX.
- Načtení dříve uložené GPX trasy.
- Export aktuálního výřezu nebo větší mapy do PNG.
- Export výškového profilu do PNG a tabulky úseků do DOC.

## Základní ovládání

1. Otevřete aplikaci v moderním webovém prohlížeči.
2. Vyhledávacím polem v horní liště najděte obec, místo, adresu nebo turistický cíl.
3. V horní liště zvolte režim práce s mapou:
   - **Prohlížet**: mapa se jen posouvá a přibližuje, body trasy se nepřidávají.
   - **Trasa po cestách**: klikáním přidáváte body a aplikace mezi nimi dopočítá trasu po cestách, stezkách nebo silnicích.
   - **Trasa volně**: klikáním přidáváte ruční rovné úseky.
4. Kliknutím do mapy přidejte bod trasy. První bod trasu založí, každý další bod vytvoří nový úsek.
5. Očíslované body můžete přetahovat myší a trasu tím upravit.
6. Bod smažete kliknutím na očíslovanou značku, případně pravým kliknutím na značku a volbou **Vymazat bod**.

## Typ trasy

Po přidání alespoň dvou bodů se dole zobrazí panel s přehledem trasy. V něm můžete vybrat profil, podle kterého se dopočítávají úseky po cestách:

- **Pěšky turistická** nebo **Pěšky rychlá**.
- **Kolo silniční** nebo **Kolo horské**.
- **Auto rychlá s provozem**, **Auto rychlá** nebo **Auto krátká**.

Změna profilu trasu přepočítá. Volné úseky zůstávají rovné.

## Přehled trasy

Spodní panel lze sbalit nebo rozbalit.

Ve sbaleném stavu ukazuje hlavní hodnoty: délku, odhadovaný čas, stoupání a klesání. Po rozbalení navíc obsahuje:

- výškový profil,
- tabulku úseků mezi body,
- přepínače sloupců pro vzdálenost, čas, stoupání a klesání,
- export **Profil PNG**,
- export **Tabulka DOC**.

Výškové hodnoty se počítají z geometrie trasy a po změně trasy se mohou chvíli načítat.

## Vzhled a soubory trasy

V horní nabídce **Trasa** upravíte vzhled trasy:

- barvu,
- šířku,
- šrafování,
- průhlednost,
- zobrazení nebo skrytí očíslovaných značek.

Ve stejné nabídce jsou také souborové a pracovní akce:

- **Načíst trasu**: načte GPX soubor.
- **Uložit trasu**: stáhne aktuální trasu jako GPX.
- **Vymazat trasu**: smaže aktuální trasu z mapy.

Export GPX obsahuje editační body pro další práci v Trasovníku a zároveň stopu trasy pro použití v jiných mapových nástrojích.

## Nastavení mapy

V horní nabídce **Mapa** nastavíte mapový podklad:

- barevný nebo černobílý tón mapy,
- základní, turistický, letecký nebo zimní podklad,
- zapnutí nebo vypnutí vrstvy turistických tras,
- export obrázku přes **Uložit obrázek**.

## Export obrázku mapy

Přes **Mapa -> Uložit obrázek** uložíte mapu jako PNG.

Vybrat můžete:

- **Aktuální výřez**: uloží přesně oblast, kterou právě vidíte v aplikaci.
- **Velká mapa**: uloží větší čtvercovou mapu kolem aktuálního středu.

U velké mapy lze nastavit velikost obrázku, měřítko a případně posunout střed exportu šipkami. Dialog ukazuje náhled a upozorní, když bude část trasy mimo výsledný obrázek.

## Praktické tipy

- Když chcete mapu jen posouvat, přepněte zpět na **Prohlížet**.
- Při vkládání bodů na husté síti cest si mapu nejdřív přibližte.
- **Trasa volně** se hodí pro přechody mimo značené cesty, dočasné objížďky nebo místa, kde trasu nechcete vést po mapovaných cestách.
- Před většími úpravami si trasu uložte do GPX.
- Černobílý tón mapy se hodí pro čistší tiskové výstupy.
