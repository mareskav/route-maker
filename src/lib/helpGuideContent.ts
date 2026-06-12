import type { Language } from "@/lib/i18n"

export type HelpGuideContent = {
  close: string
  title: string
  subtitle: string
  sections: readonly {
    title: string
    items: readonly string[]
  }[]
  tipsTitle: string
  tips: readonly string[]
}

export const helpGuides = {
  cs: {
    close: "Zavřít návod",
    title: "Návod",
    subtitle: "Rychlý postup pro kreslení, úpravy a export trasy.",
    sections: [
      {
        title: "Najít místo",
        items: [
          "Do vyhledávání nahoře napiš obec, adresu nebo bod v mapě.",
          "Vyber výsledek ze seznamu a mapa se na něj přesune."
        ]
      },
      {
        title: "Vytvořit trasu",
        items: [
          "Zvol Trasa po cestách pro automatické vedení po cestní síti.",
          "Zvol Trasa volně pro přímé úseky mezi kliknutými body.",
          "Klikáním do mapy přidávej body trasy; body můžeš přetáhnout nebo smazat přes menu bodu pravým kliknutím."
        ]
      },
      {
        title: "Upravit a uložit",
        items: [
          "V menu Trasa nastav barvu, šířku, čárkování a viditelnost značek.",
          "Trasu můžeš uložit do souboru nebo znovu načíst z GPX."
        ]
      },
      {
        title: "Mapa a export",
        items: [
          "V menu Mapa přepni podklad, tón mapy a turistické trasy.",
          "Uložit obrázek otevře náhled, kde zvolíš rozsah a velikost exportu."
        ]
      }
    ],
    tipsTitle: "Tipy",
    tips: [
      "Režim Prohlížet použij, když chceš jen posouvat mapu bez přidávání bodů.",
      "Spodní panel ukazuje délku, čas, převýšení a úseky mezi body."
    ]
  },
  en: {
    close: "Close guide",
    title: "Guide",
    subtitle: "A quick workflow for drawing, editing, and exporting a route.",
    sections: [
      {
        title: "Find a place",
        items: [
          "Type a city, address, or map point into the search field at the top.",
          "Pick a result from the list and the map will move there."
        ]
      },
      {
        title: "Create a route",
        items: [
          "Choose Route on roads for automatic routing along the road and path network.",
          "Choose Free route for straight segments between clicked points.",
          "Click the map to add route points; drag points to adjust them, or right-click a point and choose Delete point."
        ]
      },
      {
        title: "Edit and save",
        items: [
          "Use the Route menu to set color, width, dashes, and marker visibility.",
          "Save the route to a file or load it again from GPX."
        ]
      },
      {
        title: "Map and export",
        items: [
          "Use the Map menu to switch base maps, map tone, and tourist routes.",
          "Save image opens a preview where you choose export scope and size."
        ]
      }
    ],
    tipsTitle: "Tips",
    tips: [
      "Use Browse mode when you only want to move around the map.",
      "The bottom panel shows distance, time, elevation, and segments between points."
    ]
  },
  es: {
    close: "Cerrar guía",
    title: "Guía",
    subtitle: "Flujo rápido para dibujar, editar y exportar una ruta.",
    sections: [
      {
        title: "Buscar un lugar",
        items: [
          "Escribe una ciudad, dirección o punto del mapa en el buscador superior.",
          "Elige un resultado y el mapa se moverá allí."
        ]
      },
      {
        title: "Crear una ruta",
        items: [
          "Usa Ruta por caminos para calcular la ruta por la red de carreteras y senderos.",
          "Usa Ruta libre para crear tramos rectos entre los puntos.",
          "Haz clic en el mapa para añadir puntos; arrástralos para ajustar la ruta o haz clic derecho en un punto para eliminarlo."
        ]
      },
      {
        title: "Editar y guardar",
        items: [
          "En el menú Ruta puedes cambiar color, grosor, línea discontinua y marcadores.",
          "Guarda la ruta en un archivo o vuelve a cargarla desde GPX."
        ]
      },
      {
        title: "Mapa y exportación",
        items: [
          "En el menú Mapa cambia el fondo, el tono y las rutas turísticas.",
          "Guardar imagen abre una vista previa con alcance y tamaño de exportación."
        ]
      }
    ],
    tipsTitle: "Consejos",
    tips: [
      "Usa Explorar cuando solo quieras mover el mapa.",
      "El panel inferior muestra distancia, tiempo, desnivel y tramos entre puntos."
    ]
  },
  it: {
    close: "Chiudi guida",
    title: "Guida",
    subtitle: "Procedura rapida per disegnare, modificare ed esportare un percorso.",
    sections: [
      {
        title: "Trovare un luogo",
        items: [
          "Scrivi una città, un indirizzo o un punto della mappa nel campo di ricerca.",
          "Scegli un risultato e la mappa si sposterà lì."
        ]
      },
      {
        title: "Creare un percorso",
        items: [
          "Usa Percorso su strade per seguire automaticamente strade e sentieri.",
          "Usa Percorso libero per segmenti diretti tra i punti cliccati.",
          "Clicca sulla mappa per aggiungere punti; trascinali per correggerli oppure fai clic destro su un punto per eliminarlo."
        ]
      },
      {
        title: "Modificare e salvare",
        items: [
          "Nel menu Percorso imposti colore, larghezza, tratteggio e marcatori.",
          "Salva il percorso in un file o caricalo di nuovo da GPX."
        ]
      },
      {
        title: "Mappa ed esportazione",
        items: [
          "Nel menu Mappa cambi sfondo, tono e percorsi turistici.",
          "Salva immagine apre un'anteprima con area e dimensioni di esportazione."
        ]
      }
    ],
    tipsTitle: "Suggerimenti",
    tips: [
      "Usa Sfoglia quando vuoi solo spostarti nella mappa.",
      "Il pannello in basso mostra distanza, tempo, dislivello e segmenti."
    ]
  },
  de: {
    close: "Anleitung schließen",
    title: "Hilfe",
    subtitle: "Kurzer Ablauf zum Zeichnen, Bearbeiten und Exportieren einer Route.",
    sections: [
      {
        title: "Ort suchen",
        items: [
          "Gib oben eine Stadt, Adresse oder einen Kartenpunkt in die Suche ein.",
          "Wähle ein Ergebnis aus und die Karte springt dorthin."
        ]
      },
      {
        title: "Route erstellen",
        items: [
          "Wähle Route auf Wegen für automatische Führung über Straßen und Wege.",
          "Wähle Freie Route für gerade Abschnitte zwischen geklickten Punkten.",
          "Klicke in die Karte, um Punkte zu setzen; ziehe Punkte zum Anpassen oder lösche sie per Rechtsklick auf den Punkt."
        ]
      },
      {
        title: "Bearbeiten und speichern",
        items: [
          "Im Menü Route änderst du Farbe, Breite, Strichmuster und Marker.",
          "Speichere die Route in eine Datei oder lade sie wieder aus GPX."
        ]
      },
      {
        title: "Karte und Export",
        items: [
          "Im Menü Karte wechselst du Hintergrund, Kartenton und Wanderwege.",
          "Bild speichern öffnet eine Vorschau mit Bereich und Exportgröße."
        ]
      }
    ],
    tipsTitle: "Tipps",
    tips: [
      "Nutze Durchsuchen, wenn du nur die Karte verschieben möchtest.",
      "Die untere Leiste zeigt Distanz, Zeit, Höhenmeter und Abschnitte."
    ]
  },
  fr: {
    close: "Fermer le guide",
    title: "Guide",
    subtitle: "Parcours rapide pour dessiner, modifier et exporter un itinéraire.",
    sections: [
      {
        title: "Trouver un lieu",
        items: [
          "Saisis une ville, une adresse ou un point de carte dans la recherche.",
          "Choisis un résultat et la carte se placera dessus."
        ]
      },
      {
        title: "Créer un itinéraire",
        items: [
          "Utilise Itinéraire par routes pour suivre automatiquement routes et chemins.",
          "Utilise Itinéraire libre pour des segments droits entre les points.",
          "Clique sur la carte pour ajouter des points; fais-les glisser pour ajuster ou fais un clic droit sur un point pour le supprimer."
        ]
      },
      {
        title: "Modifier et enregistrer",
        items: [
          "Dans le menu Itinéraire, règle couleur, largeur, pointillés et marqueurs.",
          "Enregistre l'itinéraire dans un fichier ou recharge-le depuis un GPX."
        ]
      },
      {
        title: "Carte et export",
        items: [
          "Dans le menu Carte, change le fond, le ton et les itinéraires touristiques.",
          "Enregistrer l'image ouvre un aperçu avec zone et taille d'export."
        ]
      }
    ],
    tipsTitle: "Astuces",
    tips: [
      "Utilise Parcourir pour déplacer la carte sans ajouter de points.",
      "Le panneau du bas affiche distance, temps, dénivelé et segments."
    ]
  },
  hu: {
    close: "Útmutató bezárása",
    title: "Súgó",
    subtitle: "Gyors lépések útvonal rajzolásához, szerkesztéséhez és exportálásához.",
    sections: [
      {
        title: "Hely keresése",
        items: [
          "Írj várost, címet vagy térképpontot a felső keresőmezőbe.",
          "Válassz találatot, és a térkép oda ugrik."
        ]
      },
      {
        title: "Útvonal készítése",
        items: [
          "Az Útvonal utakon mód automatikusan utakra és ösvényekre illeszt.",
          "A Szabad útvonal egyenes szakaszokat rajzol a pontok között.",
          "Kattints a térképre pontok hozzáadásához; húzd őket a módosításhoz, vagy jobb kattintással töröld a pontot."
        ]
      },
      {
        title: "Szerkesztés és mentés",
        items: [
          "Az Útvonal menüben állítható a szín, vastagság, szaggatás és jelölők.",
          "Az útvonal fájlba menthető, vagy GPX-ből újra betölthető."
        ]
      },
      {
        title: "Térkép és export",
        items: [
          "A Térkép menüben váltható az alaptérkép, tónus és turistautak.",
          "A Kép mentése előnézetet nyit, ahol kiválasztható a méret és terület."
        ]
      }
    ],
    tipsTitle: "Tippek",
    tips: [
      "A Böngészés módot használd, ha csak mozgatni szeretnéd a térképet.",
      "Az alsó panel távolságot, időt, szintemelkedést és szakaszokat mutat."
    ]
  },
  fi: {
    close: "Sulje ohje",
    title: "Ohje",
    subtitle: "Nopea työnkulku reitin piirtämiseen, muokkaamiseen ja vientiin.",
    sections: [
      {
        title: "Etsi paikka",
        items: [
          "Kirjoita yläreunan hakuun kaupunki, osoite tai karttapiste.",
          "Valitse tulos, niin kartta siirtyy siihen."
        ]
      },
      {
        title: "Luo reitti",
        items: [
          "Valitse Reitti teitä pitkin automaattiseen reititykseen.",
          "Valitse Vapaa reitti suorille osuuksille pisteiden välillä.",
          "Lisää pisteitä klikkaamalla karttaa; säädä niitä vetämällä tai poista piste hiiren oikealla painikkeella."
        ]
      },
      {
        title: "Muokkaa ja tallenna",
        items: [
          "Reitti-valikossa säädät värin, leveyden, katkoviivan ja merkit.",
          "Tallenna reitti tiedostoon tai lataa se uudelleen GPX-tiedostosta."
        ]
      },
      {
        title: "Kartta ja vienti",
        items: [
          "Kartta-valikossa vaihdat taustakartan, sävyn ja retkeilyreitit.",
          "Tallenna kuva avaa esikatselun, jossa valitset alueen ja koon."
        ]
      }
    ],
    tipsTitle: "Vinkit",
    tips: [
      "Käytä Selaa-tilaa, kun haluat vain siirtää karttaa.",
      "Alapaneeli näyttää matkan, ajan, korkeuseron ja osuudet."
    ]
  },
  pl: {
    close: "Zamknij instrukcję",
    title: "Instrukcja",
    subtitle: "Krótki sposób rysowania, edycji i eksportu trasy.",
    sections: [
      {
        title: "Znajdź miejsce",
        items: [
          "Wpisz u góry miasto, adres albo punkt na mapie.",
          "Wybierz wynik, a mapa przesunie się w to miejsce."
        ]
      },
      {
        title: "Utwórz trasę",
        items: [
          "Wybierz Trasę po drogach, aby prowadzić po sieci dróg i ścieżek.",
          "Wybierz Trasę swobodną dla prostych odcinków między punktami.",
          "Klikaj mapę, aby dodać punkty; przeciągaj je, aby poprawić przebieg, albo kliknij punkt prawym przyciskiem, aby go usunąć."
        ]
      },
      {
        title: "Edytuj i zapisz",
        items: [
          "W menu Trasa ustaw kolor, grubość, kreskowanie i widoczność znaczników.",
          "Zapisz trasę do pliku albo wczytaj ją ponownie z GPX."
        ]
      },
      {
        title: "Mapa i eksport",
        items: [
          "W menu Mapa zmień podkład, ton mapy i szlaki turystyczne.",
          "Zapisz obraz otwiera podgląd z wyborem obszaru i rozmiaru."
        ]
      }
    ],
    tipsTitle: "Wskazówki",
    tips: [
      "Użyj Przeglądaj, gdy chcesz tylko przesuwać mapę.",
      "Dolny panel pokazuje dystans, czas, przewyższenie i odcinki."
    ]
  },
  sk: {
    close: "Zavrieť návod",
    title: "Návod",
    subtitle: "Rýchly postup na kreslenie, úpravu a export trasy.",
    sections: [
      {
        title: "Nájsť miesto",
        items: [
          "Do vyhľadávania hore napíš obec, adresu alebo bod v mape.",
          "Vyber výsledok zo zoznamu a mapa sa naň presunie."
        ]
      },
      {
        title: "Vytvoriť trasu",
        items: [
          "Zvoľ Trasa po cestách pre automatické vedenie po cestnej sieti.",
          "Zvoľ Trasa voľne pre priame úseky medzi kliknutými bodmi.",
          "Klikaním do mapy pridávaj body trasy; body môžeš presúvať alebo vymazať cez menu bodu pravým kliknutím."
        ]
      },
      {
        title: "Upraviť a uložiť",
        items: [
          "V menu Trasa nastav farbu, šírku, čiarkovanie a značky.",
          "Trasu môžeš uložiť do súboru alebo znova načítať z GPX."
        ]
      },
      {
        title: "Mapa a export",
        items: [
          "V menu Mapa prepni podklad, tón mapy a turistické trasy.",
          "Uložiť obrázok otvorí náhľad s rozsahom a veľkosťou exportu."
        ]
      }
    ],
    tipsTitle: "Tipy",
    tips: [
      "Režim Prehliadať použi, keď chceš iba posúvať mapu.",
      "Spodný panel ukazuje dĺžku, čas, prevýšenie a úseky."
    ]
  },
  bcs: {
    close: "Zatvori uputstvo",
    title: "Uputstvo",
    subtitle: "Brzi postupak za crtanje, uređivanje i izvoz rute.",
    sections: [
      {
        title: "Pronađi mjesto",
        items: [
          "U pretragu na vrhu upiši grad, adresu ili tačku na mapi.",
          "Izaberi rezultat i mapa će se pomjeriti tamo."
        ]
      },
      {
        title: "Napravi rutu",
        items: [
          "Izaberi Rutu po putevima za automatsko vođenje po cestama i stazama.",
          "Izaberi Slobodnu rutu za prave dionice između kliknutih tačaka.",
          "Klikom na mapu dodaj tačke; prevuci ih za podešavanje ili desnim klikom na tačku izaberi brisanje."
        ]
      },
      {
        title: "Uredi i sačuvaj",
        items: [
          "U meniju Ruta podesi boju, širinu, isprekidanu liniju i markere.",
          "Rutu možeš sačuvati u fajl ili je ponovo učitati iz GPX-a."
        ]
      },
      {
        title: "Mapa i izvoz",
        items: [
          "U meniju Mapa promijeni podlogu, ton i turističke rute.",
          "Sačuvaj sliku otvara pregled za izbor područja i veličine."
        ]
      }
    ],
    tipsTitle: "Savjeti",
    tips: [
      "Koristi Pregledaj kada želiš samo pomjerati mapu.",
      "Donji panel prikazuje udaljenost, vrijeme, uspon i dionice."
    ]
  },
  vi: {
    close: "Đóng hướng dẫn",
    title: "Hướng dẫn",
    subtitle: "Quy trình nhanh để vẽ, chỉnh sửa và xuất tuyến đường.",
    sections: [
      {
        title: "Tìm địa điểm",
        items: [
          "Nhập thành phố, địa chỉ hoặc điểm bản đồ vào ô tìm kiếm phía trên.",
          "Chọn một kết quả và bản đồ sẽ di chuyển đến đó."
        ]
      },
      {
        title: "Tạo tuyến đường",
        items: [
          "Chọn Tuyến theo đường để tự động đi theo mạng đường và lối mòn.",
          "Chọn Tuyến tự do để tạo các đoạn thẳng giữa các điểm.",
          "Bấm vào bản đồ để thêm điểm; kéo điểm để chỉnh tuyến hoặc nhấp chuột phải vào điểm để xóa."
        ]
      },
      {
        title: "Chỉnh sửa và lưu",
        items: [
          "Trong menu Tuyến, chỉnh màu, độ rộng, nét đứt và điểm đánh dấu.",
          "Lưu tuyến vào tệp hoặc tải lại từ GPX."
        ]
      },
      {
        title: "Bản đồ và xuất",
        items: [
          "Trong menu Bản đồ, đổi nền, tông màu và tuyến du lịch.",
          "Lưu hình ảnh mở bản xem trước để chọn phạm vi và kích thước."
        ]
      }
    ],
    tipsTitle: "Mẹo",
    tips: [
      "Dùng chế độ Duyệt khi chỉ muốn di chuyển bản đồ.",
      "Bảng dưới cùng hiển thị quãng đường, thời gian, độ cao và các đoạn."
    ]
  },
  ko: {
    close: "도움말 닫기",
    title: "도움말",
    subtitle: "경로를 그리고, 수정하고, 내보내는 빠른 방법입니다.",
    sections: [
      {
        title: "장소 찾기",
        items: [
          "상단 검색창에 도시, 주소 또는 지도 지점을 입력합니다.",
          "결과를 선택하면 지도가 해당 위치로 이동합니다."
        ]
      },
      {
        title: "경로 만들기",
        items: [
          "도로 경로를 선택하면 도로와 길 네트워크를 따라 자동 계산됩니다.",
          "자유 경로를 선택하면 클릭한 지점 사이를 직선으로 연결합니다.",
          "지도를 클릭해 지점을 추가하고, 지점을 끌어 조정하거나 지점을 마우스 오른쪽 버튼으로 클릭해 삭제합니다."
        ]
      },
      {
        title: "수정 및 저장",
        items: [
          "경로 메뉴에서 색상, 두께, 점선, 마커 표시를 설정합니다.",
          "경로를 파일로 저장하거나 GPX에서 다시 불러올 수 있습니다."
        ]
      },
      {
        title: "지도와 내보내기",
        items: [
          "지도 메뉴에서 배경 지도, 색조, 관광 경로를 바꿉니다.",
          "이미지 저장은 범위와 크기를 고르는 미리보기를 엽니다."
        ]
      }
    ],
    tipsTitle: "팁",
    tips: [
      "지도만 움직이고 싶을 때는 보기 모드를 사용하세요.",
      "아래 패널에는 거리, 시간, 고도, 구간 정보가 표시됩니다."
    ]
  },
  ja: {
    close: "ヘルプを閉じる",
    title: "ヘルプ",
    subtitle: "ルートの作成、編集、エクスポートの簡単な流れです。",
    sections: [
      {
        title: "場所を探す",
        items: [
          "上部の検索欄に都市、住所、または地図上の地点を入力します。",
          "候補を選ぶと、その場所へ地図が移動します。"
        ]
      },
      {
        title: "ルートを作成",
        items: [
          "道路ルートは道路や道のネットワークに沿って自動計算します。",
          "自由ルートはクリックした地点同士を直線で結びます。",
          "地図をクリックして地点を追加し、ドラッグして調整するか、地点を右クリックして削除できます。"
        ]
      },
      {
        title: "編集と保存",
        items: [
          "ルートメニューで色、太さ、破線、マーカー表示を設定します。",
          "ルートをファイルに保存したり、GPXから再読み込みできます。"
        ]
      },
      {
        title: "地図とエクスポート",
        items: [
          "地図メニューで背景地図、色調、観光ルートを切り替えます。",
          "画像を保存では、範囲とサイズを選ぶプレビューが開きます。"
        ]
      }
    ],
    tipsTitle: "ヒント",
    tips: [
      "地図を動かすだけなら表示モードを使います。",
      "下部パネルに距離、時間、標高、地点間の区間が表示されます。"
    ]
  },
  uk: {
    close: "Закрити інструкцію",
    title: "Інструкція",
    subtitle: "Швидкий порядок для малювання, редагування й експорту маршруту.",
    sections: [
      {
        title: "Знайти місце",
        items: [
          "Введи місто, адресу або точку на мапі у верхнє поле пошуку.",
          "Вибери результат, і мапа переміститься до нього."
        ]
      },
      {
        title: "Створити маршрут",
        items: [
          "Обери Маршрут дорогами для автоматичного ведення дорогами й стежками.",
          "Обери Вільний маршрут для прямих відрізків між точками.",
          "Клікай по мапі, щоб додавати точки; перетягуй їх для корекції або клацни точку правою кнопкою, щоб видалити."
        ]
      },
      {
        title: "Редагувати й зберегти",
        items: [
          "У меню Маршрут налаштуй колір, товщину, пунктир і маркери.",
          "Маршрут можна зберегти у файл або знову завантажити з GPX."
        ]
      },
      {
        title: "Мапа й експорт",
        items: [
          "У меню Мапа перемикай підкладку, тон і туристичні маршрути.",
          "Зберегти зображення відкриває попередній перегляд з розміром і областю."
        ]
      }
    ],
    tipsTitle: "Поради",
    tips: [
      "Режим Перегляд використовуй, коли потрібно лише рухати мапу.",
      "Нижня панель показує відстань, час, набір висоти й відрізки."
    ]
  },
  kk: {
    close: "Нұсқаулықты жабу",
    title: "Нұсқаулық",
    subtitle: "Маршрутты сызу, өңдеу және экспорттау үшін қысқа тәртіп.",
    sections: [
      {
        title: "Орынды табу",
        items: [
          "Жоғарғы іздеу өрісіне қала, мекенжай немесе карта нүктесін жаз.",
          "Нәтижені таңдасаң, карта сол жерге жылжиды."
        ]
      },
      {
        title: "Маршрут жасау",
        items: [
          "Жолдар бойынша маршрут жолдар мен соқпақтармен автоматты жүргізеді.",
          "Еркін маршрут басылған нүктелердің арасын түзу сызықпен қосады.",
          "Нүкте қосу үшін картаны бас; түзету үшін нүктелерді сүйре немесе жою үшін нүктені тінтуірдің оң жағымен бас."
        ]
      },
      {
        title: "Өңдеу және сақтау",
        items: [
          "Маршрут мәзірінде түс, қалыңдық, сызықша және маркерлерді бапта.",
          "Маршрутты файлға сақтауға немесе GPX-тен қайта жүктеуге болады."
        ]
      },
      {
        title: "Карта және экспорт",
        items: [
          "Карта мәзірінде қабатты, карта реңкін және туристік бағыттарды ауыстыр.",
          "Суретті сақтау аймақ пен өлшем таңдауға арналған алдын ала көріністі ашады."
        ]
      }
    ],
    tipsTitle: "Кеңестер",
    tips: [
      "Картаны ғана жылжытқың келсе, Қарау режимін қолдан.",
      "Төменгі панель қашықтықты, уақытты, биіктікті және бөліктерді көрсетеді."
    ]
  },
  uz: {
    close: "Qoʻllanmani yopish",
    title: "Qoʻllanma",
    subtitle: "Marshrut chizish, tahrirlash va eksport qilish uchun qisqa tartib.",
    sections: [
      {
        title: "Joyni topish",
        items: [
          "Yuqoridagi qidiruvga shahar, manzil yoki xarita nuqtasini yozing.",
          "Natijani tanlang va xarita o‘sha joyga siljiydi."
        ]
      },
      {
        title: "Marshrut yaratish",
        items: [
          "Yoʻllar bo‘yicha marshrut yoʻl va soʻqmoqlar tarmogʻi orqali hisoblaydi.",
          "Erkin marshrut bosilgan nuqtalar orasida toʻgʻri kesmalar yaratadi.",
          "Nuqta qoʻshish uchun xaritani bosing; sozlash uchun nuqtalarni torting yoki oʻchirish uchun nuqtani oʻng tugma bilan bosing."
        ]
      },
      {
        title: "Tahrirlash va saqlash",
        items: [
          "Marshrut menyusida rang, qalinlik, chiziq turi va belgilarni sozlang.",
          "Marshrutni faylga saqlash yoki GPX’dan qayta yuklash mumkin."
        ]
      },
      {
        title: "Xarita va eksport",
        items: [
          "Xarita menyusida asos, rang ohangi va sayyohlik yoʻllarini almashtiring.",
          "Rasmni saqlash eksport hududi va oʻlchamini tanlash oynasini ochadi."
        ]
      }
    ],
    tipsTitle: "Maslahatlar",
    tips: [
      "Faqat xaritani siljitmoqchi boʻlsangiz, Koʻrish rejimidan foydalaning.",
      "Pastki panel masofa, vaqt, balandlik va kesmalarni koʻrsatadi."
    ]
  },
  ru: {
    close: "Закрыть инструкцию",
    title: "Инструкция",
    subtitle: "Короткий порядок для рисования, редактирования и экспорта маршрута.",
    sections: [
      {
        title: "Найти место",
        items: [
          "Введи город, адрес или точку на карте в верхнее поле поиска.",
          "Выбери результат, и карта переместится к нему."
        ]
      },
      {
        title: "Создать маршрут",
        items: [
          "Маршрут по дорогам автоматически ведет по дорогам и тропам.",
          "Свободный маршрут создает прямые отрезки между выбранными точками.",
          "Кликай по карте для добавления точек; перетаскивай их для правки или щелкни точку правой кнопкой, чтобы удалить."
        ]
      },
      {
        title: "Редактировать и сохранить",
        items: [
          "В меню Маршрут настраиваются цвет, толщина, пунктир и маркеры.",
          "Маршрут можно сохранить в файл или снова загрузить из GPX."
        ]
      },
      {
        title: "Карта и экспорт",
        items: [
          "В меню Карта переключаются подложка, тон карты и туристические маршруты.",
          "Сохранить изображение открывает предпросмотр с областью и размером."
        ]
      }
    ],
    tipsTitle: "Советы",
    tips: [
      "Режим Просмотр используй, когда нужно только двигать карту.",
      "Нижняя панель показывает расстояние, время, высоту и участки."
    ]
  }
} satisfies Record<Language, HelpGuideContent>
