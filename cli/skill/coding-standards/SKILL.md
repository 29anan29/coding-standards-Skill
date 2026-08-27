***

name: "coding-standards"
description: "A cross-language engineering coding standard that guides AI coding agents when writing, reviewing, or refactoring code. Invoke when the user asks for clean, consistent, maintainable, idiomatic code, for code review/sign-off, or when a strict, reviewer-friendly style is required. Applicable to C, Rust, Go, and other languages."
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Engineering Coding Standards

These standards produce code that is easy to read, reason about, and review,
across C, Rust, Go, and related languages. They reflect widely accepted,
reviewer-friendly conventions: keep it simple, be explicit, and stay
consistent.

Principles are grouped below. Items marked **hard** are mandatory for any
submitted work; items marked **soft** are strong recommendations.

When a specific language has an official style guide or default formatter
(see [Automated formatting](#9-automated-formatting)), that official style
takes precedence over the general guidance here for conflicting details.

***

## 1 Indentation

* Use a consistent indentation unit, **one Tab or the language's idiomatic
  setting** (spaces for Go, 4-space for Rust). Never mix tabs and spaces.
  Follow the language's official style when it disagrees.

* Rewrite code that nests more than \~3 levels deep; do not widen the
  indentation to accommodate nesting. Deep nesting is a design smell.

* One statement per line. Do not put multiple assignments or statements on a
  single line to save space.

* Use a single tab per level; keep the flow readable without tricks.

## 2 Line Length & Strings

* Keep lines reasonably short (commonly up to 80-100 columns).

* Break overlong statements into sensible pieces; indent continuations clearly
  and consistently (commonly aligned under the opening parenthesis).

* **Never break user-visible strings** (log messages, error strings, UI text).
  Splitting them breaks searching/grepping and localization.

## 3 Braces & Spacing

### Braces

* Use a consistent brace style. The widely used, reviewer-friendly style is
  K&R: the **opening brace at the end of the line** for statement blocks
  (`if`/`for`/`while`/`switch`), the closing brace on its own line.

* Keep multi-line conformations compact: `} else {`, `} while (...)`, etc.

* For single statements, braces are optional; if **any** branch of a
  conditional or any iteration body needs braces, use them on **all** branches
  of that construct for symmetry.

* A function's opening brace may start on the next line if that is the
  language convention (C/Go examples below).

```c
	if (condition) {
		do_this();
		do_that();
	} else if (other) {
		...;
	} else {
		otherwise();
	}

	while (condition) {
		if (test)
			do_something();
	}
```

### Spacing

* Put a space after flow-control keywords (`if`, `switch`, `for`, `while`,
  `do`, `case`), but **not** after call-like keywords/operators
  (`sizeof`, `typeof`, `typeof()` casts, `&`/`*`/`!` unary operators).

* No space just inside parentheses: `sizeof( struct file )` is wrong.

* One space around binary operators and the ternary `?:`.

* No space between a prefix/postfix `++` / `--` and its operand.

* No space around member-access operators `.` and `->`.

* **Never leave trailing whitespace** at end of lines.

## 4 Naming

* Local variables: short and to the point (`i` for loop counters, `tmp` for
  throwaway values). Do not over-name obvious locals.

* Globals and public symbols: descriptive. A public function that counts
  active users should be `count_active_users`, never `cntusr` or `foo`.

* **No Hungarian notation** (encoding the type into the name). Let the
  language/compiler carry type information.

* Follow the language's naming conventions:

  * Go: `camelCase` for unexported, `CamelCase` for exported; package-level
    short names.

  * Rust: `snake_case` for functions/variables, `CamelCase` for types,
    `SCREAMING_SNAKE_CASE` for constants.

  * C: `snake_case` by convention.

* Avoid new usage of `master/slave` and `blacklist/whitelist` terminology;
  prefer `{primary,main}/{secondary,replica}` and `denylist/allowlist`
  (or platform/language-preferred terms).

## 5 Type Abstractions

* Prefer explicit, self-describing types (e.g. `struct Account *a` over an
  opaque `acc_t`). Do not create typedefs purely for convenience; hiding a
  type behind an opaque alias makes the code harder to reason about.

* Ediomatic abstraction (`serde` types, generic constraints, type aliases
  that carry meaning) is fine; a pointer or a directly-accessible struct
  should not be hidden behind a meaningless name.

* Use the language's own kinds of type abstraction (`typedef`/`using`,
  generics/traits/interfaces) where they add safety or clarity, not as
  decoration.

## 6 Functions & Scope

* Keep functions short, focused, and responsible for **one thing**.

* If a function exceeds roughly a screen or needs more than \~5-10 locals,
  split it into helper functions with descriptive names.

* Declare prototypes/signatures with meaningful parameter names, not just
  types.

* Do not use unnecessary `extern` (C) — declarations are implicitly external.

* Group related helpers and keep the call graph shallow.

## 7 Centralized Control Flow & Cleanup

* When a function can exit from many points and shared cleanup is needed,
  centralize that cleanup rather than duplicating it at every exit.

* C-style: use descriptive `goto` labels (`out_free_*`, `err_*`) for cleanup,
  and `return` directly when nothing needs cleaning up. Avoid numbering labels
  like `err1`/`err2`.

* Go-style: use `defer` for resource/cleanup logic; it runs regardless of
  return path.

* Rust-style: rely on RAII and `Drop`; avoid manually duplicated cleanup.

* Beware of partial-failure cleanup bugs: each resource must be released
  exactly once, even when earlier steps failed.

## 8 Comments

* Comment **WHAT** (purpose) and **WHY** (rationale), not **HOW**
  (mechanism). If the mechanism is not obvious, improve the code first.

* Avoid excessive comments inside function bodies; prefer a short header that
  states what and why.

* Use the multi-line comment style favored by the language (a leading
  `*` column for C-family):

```c
	/*
	 * Describe the purpose and rationale here,
	 * one idea per paragraph.
	 */
```

* Declare one item per line where useful, leaving room for a per-item comment.

* For public APIs, use the language/ecosystem's doc comment convention
  (Rust `//!`/`///` doc comments, Go `//` preceding public symbols, C kernels =
  `/** */` style). Avoid boilerplate that merely repeats the signature.

## 9 Automated Formatting

* Adopt the language's canonical formatter and run it before committing:

  * C/C++: `clang-format`; Go: `gofmt`; Rust: `rustfmt`.

* Use linters/clippy for stylistic and correctness feedback.

* Version-control diffs should contain **no formatting-only noise** beyond the
  change at hand.

## 10 Memory, Ownership & Resource Management

* Be deliberate about ownership, lifetime, and teardown of every resource.

  * Rust: leverage ownership, borrowing, lifetimes, and `Drop`; avoid raw
    pointers and `unsafe` unless unavoidable.

  * Go: prefer interfaces and clear ownership; account for `Close()`,
    `defer`, and goroutine lifetimes; avoid leaks.

  * C: manage everything explicitly — pair each allocation/acquire with a
    matching release on **every** path.

* For shared, externally-visible state, use explicit lifecycle management
  (reference counting / RAII / closures), and make the object alive as long
  as any user may hold it.

* Do not silently swallow errors; release resources even on early returns.

## 11 Data Structures & Concurrency

* Design concurrent access with clear ownership rules. Reference counting or
  garbage collection alone — where provided — must be paired with the right
  synchronization primitive; the two are not interchangeable.

* Prefer language-native concurrency primitives over hand-rolled ones:
  mutexes/atomics across languages; channels/goroutines in Go; `mpsc`,
  `Arc`, `Mutex` in Rust.

* Never mutate shared state without the appropriate synchronization, and make
  the locking/lifetime contract explicit and local.

## 12 Constants, Enums & Idiomatic Abstractions

* Name constants in `SCREAMING_SNAKE_CASE` (C/Rust/Go where applicable).

* Prefer enums for a group of related constants.

* **Prefer functions over macros** for logic. In C, if a macro-like construct
  is a true function, make it `static inline`; wrap multi-statement macros in
  `do { ... } while (0)`.

* Wrap macro/expression parameters in parentheses to avoid precedence bugs.

* Do not write macros that alter control flow (`return` from the caller),
  depend on magic local names, or are used as l-values — these are fragile and
  surprising.

## 13 Logging & Diagnostics

* Use the project's logging facility with proper levels
  (debug/info/warn/error). Structured logging is preferred where idiomatic
  (Go `log/slog`, Rust `tracing`/`log`, C `libfmt`/custom).

* Write concise, clear, unambiguous messages; correct spelling matters.

* Match diagnostics to the right component/context (e.g. request ID,
  entity name) so they can be correlated.

* Keep the happy path quiet; emit most detail at debug level.

## 14 Performance

* Do not add `inline`/micro-optimization speculatively. Prefer readable code
  and let the optimizer/compiler work (C: let the compiler inline; keep
  functions with substantial bodies non-`inline`).

* Optimize only after profiling shows a need, and document why.

## 15 Return Values & Error Handling

* Make the return convention follow the name:

  * **Action / imperative** function name → return an **error code** /
    `Result`/`error` (0 success, non-zero failure, or explicit error type).

  * **Predicate** function name (`is_*`/`has_*`/`*_present`) → return a
    **boolean** (succeeded semantics).

* Do not mix "error code" and "boolean" semantics for the same function.

* Idiomatic handling:

  * Rust: return `Result<T, E>` and propagate with `?`; do **not** use
    `panic!`/`unwrap`/`expect` on the failure path of library/API code.

  * Go: return `(value, error)`, check `err != nil`, and **handle** the error;
    do not `panic` for expected conditions.

  * C: return `-Exxx`/`NULL`/`ERR_PTR` style sentinels and check them.

## 16 Booleans

* Use a real boolean type (`bool`) and `true`/`false`, not `1`/`0` integers.

* Do not add `!!`-style coercions; languages with proper booleans already
  produce `true`/`false`.

* Where a struct holds many flags, prefer a bitfield or a single `flags`
  argument over several naked booleans.

## 17 Reuse Standard Library

* Do not reinvent utilities that the ecosystem already provides
  (`ARRAY_SIZE`-style helpers, `min`/`max`, `len`/`length`, string/collection
  helpers).

* Reuse tested standard libraries and idiomatic helpers over hand-rolled
  copies; it is faster, safer, and easier to review.

## 18 Editor / Format Metadata Hygiene

* **Do not** embed editor-specific configuration in source files
  (`-*- mode: c -*-`, `vim: sw=8`, Emacs `Local Variables`). Users have their
  own editor settings.

* Put project-wide formatting rules in `.editorconfig` / formatter config
  files instead.

## 19 Low-Level / Unsafe Constructs

* Prefer safe constructs over `unsafe`/raw pointers when the language offers
  a safe alternative.

* Rust: confine `unsafe` to small, well-documented wrappers with safety
  invariants documented on the enclosing item.

* C: prefer portable C over inline assembly; extract common low-level idioms
  into helper functions; for multi-instruction assembly, put each instruction
  on its own `asm` string continuation.

## 20 Feature Gating & Conditional Code

* Prefer runtime/explicit feature checks over scattering preprocessor
  conditionals through source.

  * C: use `IS_ENABLED`-style compile-time booleans in ordinary conditionals;
    only use `#ifdef` when referenced symbols do not exist without it. Mark
    possibly-unused items with the appropriate attribute instead of wrapping
    them in conditionals; delete truly-unused code.

  * Go: use build tags / feature flags at the module level, not inline
    preprocessor-style clutter in every function.

  * Rust: use Cargo features and `cfg` consistently, keeping the gating
    localized.

* When a non-trivial `#ifdef` block ends, annotate the `#endif` with the
  condition it matches.

## 21 Robustness: Fail Safely

* Unexpected-condition handlers must not take down the whole program.

  * C: prefer `WARN_ON*`-style warnings with optional recovery over
    hard `BUG()`/`abort()`; reserve hard failure for truly unrecoverable
    corruption; prefer compile-time `BUILD_BUG_ON` assertions at zero runtime
    cost.

  * Go/Rust: do not panic/abort for expected, user- or input-driven
    conditions; `panic!`/`log.Fatal`/`os.Exit` are last resorts.

***

## Deliverable Checklist

Check every item before delivering code:

* [ ] Consistent indentation (one unit type, no tabs/spaces mix); no trailing
  whitespace.

* [ ] Lines within the target width; continuations aligned; user-visible
  strings not broken.

* [ ] Consistent brace & spacing style (K\&R statement blocks; symmetric braces
  when any branch is multi-statement).

* [ ] Naming: short locals, descriptive globals/publics, language-native case
  convention, no Hungarian, no `master/slave`/`blacklist` terms.

* [ ] No opaque typedefs hiding directly-accessible types.

* [ ] Functions short, single-purpose, ≤ \~5-10 locals; prototypes carry
  parameter names; no stray `extern` (C).

* [ ] Cleanup centralized (goto/defer/RAII) and released exactly once on all
  paths.

* [ ] Comments state what/why, not how; idiomatic doc comments without
  boilerplate.

* [ ] Formatter/linter pass (rustfmt/gofmt/clang-format); no formatting noise.

* [ ] Memory/ownership/teardown correct on every path; shared state
  synchronized with a documented contract.

* [ ] Constants/enums idiomatic; functions preferred over macros; multi-statement
  macros wrapped.

* [ ] Logging: appropriate levels, concise, context-tagged; quiet happy path.

* [ ] Return convention matches name (action → error / `Result`; predicate →
  boolean); errors handled, not swallowed; no panic/abort for expected cases.

* [ ] Booleans use `bool`/`true`/`false`.

* [ ] Reuses standard library; no reinventing helpers.

* [ ] Editor modelines absent; formatting rules in `.editorconfig`/config.

* [ ] `unsafe`/low-level code minimized and documented; conditional gating
  localized and `#endif` annotated.

* [ ] Fail-safe error handling; no hard-crash constructs for expected inputs.

## Language Quick Reference

| Area         | C                                                            | Rust                                                | Go                                           |
| ------------ | ------------------------------------------------------------ | --------------------------------------------------- | -------------------------------------------- |
| Formatter    | `clang-format` (+ `indent -kr -i8`)                          | `rustfmt`                                           | `gofmt`                                      |
| Indent       | Tabs (8)                                                     | 4 spaces                                            | Tabs (formatter)                             |
| Names        | `snake_case`                                                 | `snake_case` / `CamelCase` / `SCREAMING_SNAKE_CASE` | `camelCase` / `CamelCase`                    |
| Errors       | `-Exxx` / `NULL` / `ERR_PTR` sentinels, `goto`-based cleanup | `Result<T,E>` + `?`, `Option`, RAII/`Drop`          | `(T, error)`, `defer`, explicit `err != nil` |
| Booleans     | `bool` + `true/false`                                        | `bool` (no `!!`)                                    | `bool`                                       |
| Concurrency  | mutex/atomics, manual lifetime                               | `Arc`, `Mutex`, channels                            | goroutines, channels, sync                   |
| Feature gate | `#ifdef`/`IS_ENABLED`                                        | Cargo features + `cfg`                              | build tags                                   |

