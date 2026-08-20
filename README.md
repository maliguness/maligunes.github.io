# maligunes.github.io

Sade, modern görünümlü tek sayfalık web sitesi. HTML, CSS ve vanilla JavaScript ile yazıldı; framework kullanılmadı.

## Lokal Olarak Açma

Dosyaları doğrudan tarayıcıda açabilirsiniz:

```bash
open index.html
```

Veya basit bir lokal sunucu ile çalıştırabilirsiniz:

```bash
python3 -m http.server 8000
```

Ardından tarayıcıda `http://localhost:8000` adresine gidin.

## Deploy Etme (GitHub Pages)

Bu repo `maligunes.github.io` adında olduğu için GitHub Pages'e otomatik olarak bağlanır:

1. Değişiklikleri `main` branşına push edin.
2. GitHub üzerinde **Settings > Pages** bölümünden Source olarak `main` branch ve `/ (root)` klasörünün seçili olduğundan emin olun.
3. Birkaç dakika içinde site `https://maligunes.github.io` adresinde yayında olur.

## Not

`index.html` içindeki `<meta name="robots" content="noindex, nofollow">` etiketi, arama motorlarının sayfayı indexlemesini engeller.
