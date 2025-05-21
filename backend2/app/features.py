# features.py
import pefile
import numpy as np
import math

def file_entropy(data: bytes) -> float:
    if not data:
        return 0.0
    entropy = 0
    length = len(data)
    byte_counts = [0]*256
    for b in data:
        byte_counts[b] += 1
    for count in byte_counts:
        if count == 0:
            continue
        p = count / length
        entropy -= p * math.log2(p)
    return entropy

def extract_features(file_path: str):
    with open(file_path, "rb") as f:
        data = f.read()

    features = {}

    # Размер файла
    features["file_size"] = len(data)

    # Энтропия
    features["entropy"] = file_entropy(data)

    try:
        pe = pefile.PE(data=data)
        features["number_of_sections"] = len(pe.sections)
        section_sizes = [s.SizeOfRawData for s in pe.sections]
        features["avg_section_size"] = np.mean(section_sizes)
        features["max_section_size"] = np.max(section_sizes)
        features["min_section_size"] = np.min(section_sizes)

        if hasattr(pe, 'DIRECTORY_ENTRY_IMPORT'):
            import_count = sum(len(entry.imports) for entry in pe.DIRECTORY_ENTRY_IMPORT)
        else:
            import_count = 0
        features["imported_functions"] = import_count

    except pefile.PEFormatError:
        features["number_of_sections"] = 0
        features["avg_section_size"] = 0
        features["max_section_size"] = 0
        features["min_section_size"] = 0
        features["imported_functions"] = 0

    # Распределение байтов
    byte_freq = np.zeros(256, dtype=float)
    for b in data:
        byte_freq[b] += 1
    byte_freq /= len(data)

    for i in range(256):
        features[f"byte_freq_{i}"] = byte_freq[i]

    return features
