# scripts/

Small, dependency-free helper(s) to apply formatting.

| Script | Purpose |
|--------|---------|
| `apply-format.sh` | Run the idiomatic formatter (`gofmt` / `rustfmt` / `clang-format`) on the given files or directories. |

```bash
sh scripts/apply-format.sh src/
sh scripts/apply-format.sh main.rs model.go parse.c
```

No network calls, no package installs.