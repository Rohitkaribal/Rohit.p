"""Concurrency + small utilities used across stages."""

from __future__ import annotations

import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any, Callable, Iterable, TypeVar

T = TypeVar("T")
R = TypeVar("R")


def get_logger(name: str = "omega_omni") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        h = logging.StreamHandler()
        h.setFormatter(logging.Formatter(
            "%(asctime)s %(levelname)-7s %(name)s | %(message)s",
            datefmt="%H:%M:%S",
        ))
        logger.addHandler(h)
    return logger


def parallel_map(
    fn: Callable[[T], R],
    items: Iterable[T],
    *,
    max_workers: int = 8,
    tolerate_failures: bool = True,
    logger: logging.Logger | None = None,
    label: str = "task",
) -> list[R]:
    """Run ``fn`` over ``items`` concurrently, collecting successful results.

    If ``tolerate_failures`` is False, the first exception propagates.
    """
    items = list(items)
    results: list[R] = []
    if not items:
        return results
    log = logger or get_logger()
    with ThreadPoolExecutor(max_workers=min(max_workers, len(items))) as ex:
        future_map = {ex.submit(fn, it): it for it in items}
        for fut in as_completed(future_map):
            it = future_map[fut]
            try:
                results.append(fut.result())
            except Exception as exc:  # noqa: BLE001
                if not tolerate_failures:
                    raise
                log.warning("%s failed for %r: %s", label, _safe_repr(it), exc)
    return results


def _safe_repr(obj: Any) -> str:
    try:
        r = repr(obj)
    except Exception:  # noqa: BLE001
        return "<unreprable>"
    return r[:120]


def clamp(x: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, x))
