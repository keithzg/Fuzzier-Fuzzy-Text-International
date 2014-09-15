#pragma once
#include "string.h"

typedef enum {
  DE    = 0x0,
  EN_GB = 0x1,
  EN_US = 0x2,
  ES    = 0x3,
  FR    = 0x4,
  NO    = 0x5,
  SV    = 0x6
} Language;

void time_to_words(Language lang, int hours, int minutes, int seconds, char* words, size_t length);
