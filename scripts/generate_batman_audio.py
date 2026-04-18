import math
import os
import struct
import wave
import random

SR = 44100


def clamp(v):
    return max(-1.0, min(1.0, v))


def write_wav(path, left, right):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        buf = bytearray()
        for l, r in zip(left, right):
            buf.extend(struct.pack("<hh", int(clamp(l) * 32767), int(clamp(r) * 32767)))
        wf.writeframes(bytes(buf))


def sine(f, t):
    return math.sin(2 * math.pi * f * t)


def saw(f, t):
    p = (f * t) % 1.0
    return 2 * p - 1


def tri(f, t):
    p = (f * t) % 1.0
    return 4 * abs(p - 0.5) - 1


def adsr(t, total, a=0.03, d=0.28, s=0.72, r=0.45):
    if t < a:
        return t / max(a, 1e-6)
    if t < a + d:
        p = (t - a) / max(d, 1e-6)
        return 1 + (s - 1) * p
    if t < total - r:
        return s
    p = (t - (total - r)) / max(r, 1e-6)
    return s * (1 - p)


def noise_lp(state, amt):
    raw = random.random() * 2 - 1
    return state * (1 - amt) + raw * amt


def load_begins(sec=2.7):
    n = int(sec * SR)
    l, r = [0.0] * n, [0.0] * n
    nz = 0.0
    for i in range(n):
        t = i / SR
        p = t / sec
        e = adsr(t, sec, a=0.04, d=0.35, s=0.66, r=0.8)
        f = 96 - 54 * p
        nz = noise_lp(nz, 0.03)
        y = (0.56 * tri(f, t) + 0.28 * sine(f * 0.52, t) + 0.22 * nz) * e * 0.48
        l[i] = y * (0.97 + 0.03 * sine(0.2, t))
        r[i] = y * (0.97 + 0.03 * sine(0.23, t))
    return l, r


def load_tdk(sec=2.85):
    n = int(sec * SR)
    l, r = [0.0] * n, [0.0] * n
    for i in range(n):
        t = i / SR
        p = t / sec
        e = adsr(t, sec, a=0.02, d=0.46, s=0.75, r=0.95)
        f1, f2 = 132 - 38 * p, 136 - 33 * p
        y = (0.52 * saw(f1, t) + 0.45 * saw(f2, t) + 0.17 * tri(510 + 90 * p, t)) * e * 0.46
        l[i] = y * (0.96 + 0.04 * sine(0.31, t))
        r[i] = y * (0.96 + 0.04 * sine(0.37, t))
    return l, r


def load_rises(sec=3.05):
    n = int(sec * SR)
    l, r = [0.0] * n, [0.0] * n
    for i in range(n):
        t = i / SR
        p = t / sec
        e = adsr(t, sec, a=0.04, d=0.5, s=0.74, r=0.95)
        f = 82 - 50 * p
        chant = 0.2 * sine(73, t) * (1 if (t % 0.63) < 0.28 else 0.58)
        y = (0.58 * tri(f, t) + 0.3 * sine(f * 0.5, t) + chant) * e * 0.5
        l[i] = y * (0.95 + 0.05 * sine(0.18, t))
        r[i] = y * (0.95 + 0.05 * sine(0.21, t))
    return l, r


def amb_begins(sec=120):
    n = int(sec * SR)
    l, r = [0.0] * n, [0.0] * n
    nz = 0.0
    for i in range(n):
        t = i / SR
        nz = noise_lp(nz, 0.008)
        y = (0.33 * tri(48 + 0.14 * sine(0.01, t), t) + 0.24 * sine(24, t) + 0.1 * sine(96, t) + 0.11 * nz) * 0.27
        l[i] = y * (0.97 + 0.03 * sine(0.07, t))
        r[i] = y * (0.97 + 0.03 * sine(0.09, t))
    return l, r


def amb_tdk(sec=120):
    n = int(sec * SR)
    l, r = [0.0] * n, [0.0] * n

    laugh_events = [5.2, 6.0, 6.8, 24.1, 24.9, 25.7, 43.7, 44.5, 45.3, 61.2, 62.0, 62.8, 84.0, 84.8, 85.6, 103.0, 103.8, 104.6]
    nz = 0.0

    def laugh_layer(t):
        out = 0.0
        for start in laugh_events:
            d = t - start
            if d < 0 or d > 0.62:
                continue
            p = d / 0.62
            env = (math.sin(math.pi * p) ** 1.8) * (0.9 + 0.1 * math.sin(2 * math.pi * 3.2 * d))
            # Lower, raspier laugh formant (avoid squeaky highs).
            base = 260 - 105 * p
            c1 = 0.075 * env * tri(base, t)
            c2 = 0.048 * env * sine(base * 0.66, t)
            c3 = 0.026 * env * sine(base * 1.45 + 4.0 * math.sin(2 * math.pi * 6.0 * d), t)
            out += c1 + c2 + c3
        return out

    for i in range(n):
        t = i / SR
        nz = noise_lp(nz, 0.01)
        gate = 0.78 + 0.22 * math.sin(2 * math.pi * (1 / 5.2) * t)
        wash = (
            0.26 * tri(44 + 0.16 * sine(0.012, t), t)
            + 0.18 * sine(88 + 0.14 * sine(0.02, t), t)
            + 0.06 * sine(220 + 0.7 * sine(0.16, t), t)
            + 0.045 * nz
        )
        laugh = laugh_layer(t)
        y = wash * gate * 0.16 + laugh * 0.16
        l[i] = y * (0.96 + 0.04 * sine(0.12, t))
        r[i] = y * (0.96 + 0.04 * sine(0.135, t))
    return l, r


def amb_rises(sec=120):
    n = int(sec * SR)
    l, r = [0.0] * n, [0.0] * n
    for i in range(n):
        t = i / SR
        gate = 0.64 + 0.36 * ((math.sin(2 * math.pi * (1 / 4.6) * t) + 1) * 0.5)
        y = (0.35 * tri(55, t) + 0.22 * sine(110, t) + 0.16 * sine(73, t) * gate + 0.08 * saw(146, t)) * 0.26
        l[i] = y * (0.96 + 0.04 * sine(0.06, t))
        r[i] = y * (0.96 + 0.04 * sine(0.065, t))
    return l, r


def main():
    out = os.path.join("public", "audio")
    write_wav(os.path.join(out, "load-batman-begins.wav"), *load_begins())
    write_wav(os.path.join(out, "load-the-dark-knight.wav"), *load_tdk())
    write_wav(os.path.join(out, "load-the-dark-knight-rises.wav"), *load_rises())
    write_wav(os.path.join(out, "ambient-batman-begins.wav"), *amb_begins())
    write_wav(os.path.join(out, "ambient-the-dark-knight.wav"), *amb_tdk())
    write_wav(os.path.join(out, "ambient-the-dark-knight-rises.wav"), *amb_rises())
    print("Generated Batman WAV assets.")


if __name__ == "__main__":
    main()
