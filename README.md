# ⬡ Obsidian CLI — 한국어 가이드

Obsidian CLI 공식 문서를 기반으로 만든 한국어 가이드 웹사이트입니다.  
CLI를 처음 접하는 사용자도 쉽게 이해하고 활용할 수 있도록 구성했습니다.

**원본 문서:** [https://help.obsidian.md/cli](https://help.obsidian.md/cli)

---

## 📌 소개

Obsidian CLI는 터미널에서 Obsidian을 직접 제어할 수 있는 명령줄 인터페이스입니다.  
이 가이드는 CLI의 주요 기능과 명령어를 한국어로 정리하여, 더 쉽고 빠르게 활용할 수 있도록 돕습니다.

- 스크립팅 및 반복 작업 자동화
- 외부 도구와의 연동 (cron, shell script, CI/CD 등)
- 플러그인·테마 개발 시 개발자 도구 활용
- TUI(터미널 UI) 기반 인터랙티브 탐색

---

## 🖥 미리보기

| 섹션 | 내용 |
|------|------|
| **Hero** | CLI 소개 및 기본 예제 코드 |
| **설치 방법** | macOS / Windows / Linux 단계별 가이드 |
| **활용 예제** | 일상 사용 / 개발자 / 자동화 스크립트 |
| **전체 명령어** | 13개 카테고리 아코디언 + 실시간 검색 |
| **키보드 단축키** | TUI 단축키 전체 목록 |
| **Troubleshooting** | 플랫폼별 문제 해결 가이드 |

---

## 🚀 로컬 실행

별도의 빌드 도구 없이 정적 파일로 바로 실행할 수 있습니다.

```bash
# 저장소 클론
git clone https://github.com/lucas-flatwhite/obsidian-cli-guide-ko.git
cd obsidian-cli-guide-ko

# Python으로 로컬 서버 실행
python3 -m http.server 3000
```

브라우저에서 `http://localhost:3000` 으로 접속하면 됩니다.

---

## 📁 파일 구조

```
obsidian-cli-guide-ko/
├── index.html   # 메인 페이지 (전체 한국어 가이드)
├── style.css    # 다크 모던 미니멀 디자인 시스템
├── app.js       # 탭 전환, 검색, 코드 복사 등 인터랙션
├── LICENSE
└── README.md
```

---

## ✨ 주요 기능

- **실시간 명령어 검색** — 검색창에 입력하면 관련 명령어를 즉시 필터링
- **코드 복사 버튼** — 모든 코드 블록을 원클릭으로 클립보드에 복사
- **OS별 탭 전환** — macOS / Windows / Linux 설치 가이드 탭
- **예제 탭** — 일상 / 개발자 / 자동화 시나리오별 예제 코드
- **반응형 디자인** — 모바일 및 데스크톱 모두 지원
- **스크롤 네비게이션** — 현재 섹션 자동 감지 및 하이라이트

---

## 🛠 기술 스택

- **HTML5 / CSS3 / Vanilla JS** — 프레임워크 없는 순수 정적 페이지
- **CSS Custom Properties** — 일관된 디자인 토큰 시스템
- **IntersectionObserver API** — 스크롤 기반 네비게이션 하이라이트

---

## 📄 라이선스

이 프로젝트는 [MIT License](./LICENSE) 하에 배포됩니다.  
가이드의 원본 내용은 [Obsidian 공식 문서](https://help.obsidian.md/cli)를 기반으로 합니다.
