import { Level } from "../core/model";

export const ALL_60_LEVELS: readonly Level[] = [
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-01",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 1,
    "titleKey": "level.w1-01.title",
    "board": {
      "width": 3,
      "height": 1,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 2,
      "y": 0
    },
    "collectibles": [],
    "gates": [],
    "switches": [],
    "commands": [
      "forward"
    ],
    "limits": {
      "maxBlocks": 3,
      "maxActions": 4
    },
    "rating": {
      "parBlocks": 2
    },
    "teaching": {
      "concept": "forward",
      "archetype": "straight",
      "difficulty": 1
    },
    "hintKeys": [
      "level.w1-01.hint.1",
      "level.w1-01.hint.2",
      "level.w1-01.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-02",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 2,
    "titleKey": "level.w1-02.title",
    "board": {
      "width": 3,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 2,
      "y": 2
    },
    "collectibles": [],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "right"
    ],
    "limits": {
      "maxBlocks": 6,
      "maxActions": 8
    },
    "rating": {
      "parBlocks": 5
    },
    "teaching": {
      "concept": "right-turn",
      "archetype": "elbow",
      "difficulty": 1
    },
    "hintKeys": [
      "level.w1-02.hint.1",
      "level.w1-02.hint.2",
      "level.w1-02.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-03",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 3,
    "titleKey": "level.w1-03.title",
    "board": {
      "width": 3,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 2,
      "facing": "E"
    },
    "goal": {
      "x": 2,
      "y": 0
    },
    "collectibles": [],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 8,
      "maxActions": 12
    },
    "rating": {
      "parBlocks": 6
    },
    "teaching": {
      "concept": "left-turn",
      "archetype": "offset-elbow",
      "difficulty": 1
    },
    "hintKeys": [
      "level.w1-03.hint.1",
      "level.w1-03.hint.2",
      "level.w1-03.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-04",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 4,
    "titleKey": "level.w1-04.title",
    "board": {
      "width": 4,
      "height": 1,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [
      {
        "id": "item-1",
        "x": 1,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 4,
      "maxActions": 6
    },
    "rating": {
      "parBlocks": 3
    },
    "teaching": {
      "concept": "required-pickup",
      "archetype": "pickup-line",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-04.hint.1",
      "level.w1-04.hint.2",
      "level.w1-04.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-05",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 5,
    "titleKey": "level.w1-05.title",
    "board": {
      "width": 3,
      "height": 2,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 2,
      "y": 0
    },
    "collectibles": [
      {
        "id": "item-1",
        "x": 1,
        "y": 1,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 9,
      "maxActions": 14
    },
    "rating": {
      "parBlocks": 7
    },
    "teaching": {
      "concept": "optional-detour",
      "archetype": "two-route-loop",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-05.hint.1",
      "level.w1-05.hint.2",
      "level.w1-05.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-06",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 6,
    "titleKey": "level.w1-06.title",
    "board": {
      "width": 3,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 0
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 2,
      "y": 0
    },
    "collectibles": [
      {
        "id": "item-1",
        "x": 1,
        "y": 1,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 9,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 7
    },
    "teaching": {
      "concept": "debug-blocked-route",
      "archetype": "obstacle-bypass",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-06.hint.1",
      "level.w1-06.hint.2",
      "level.w1-06.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-07",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 7,
    "titleKey": "level.w1-07.title",
    "board": {
      "width": 3,
      "height": 3,
      "tiles": [
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 1,
      "y": 2,
      "facing": "N"
    },
    "goal": {
      "x": 2,
      "y": 0
    },
    "collectibles": [],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 6,
      "maxActions": 10
    },
    "rating": {
      "parBlocks": 4
    },
    "teaching": {
      "concept": "facing-transfer",
      "archetype": "north-start",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-07.hint.1",
      "level.w1-07.hint.2",
      "level.w1-07.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-08",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 8,
    "titleKey": "level.w1-08.title",
    "board": {
      "width": 4,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 1
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 2,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [
      {
        "id": "item-1",
        "x": 1,
        "y": 2,
        "kind": "required"
      },
      {
        "id": "item-2",
        "x": 1,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 9,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 7
    },
    "teaching": {
      "concept": "pickup-order",
      "archetype": "two-pickup-corridor",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-08.hint.1",
      "level.w1-08.hint.2",
      "level.w1-08.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-09",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 9,
    "titleKey": "level.w1-09.title",
    "board": {
      "width": 4,
      "height": 2,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 0
        }
      ],
      "decorations": [
        {
          "x": 2,
          "y": 0,
          "kind": "tree"
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 1,
        "y": 1,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 8
    },
    "teaching": {
      "concept": "goal-prerequisites",
      "archetype": "detour",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-09.hint.1",
      "level.w1-09.hint.2",
      "level.w1-09.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-10",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 10,
    "titleKey": "level.w1-10.title",
    "board": {
      "width": 4,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 2,
      "facing": "N"
    },
    "goal": {
      "x": 3,
      "y": 2
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 0,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 18
    },
    "rating": {
      "parBlocks": 9
    },
    "teaching": {
      "concept": "block-budget",
      "archetype": "corridor",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-10.hint.1",
      "level.w1-10.hint.2",
      "level.w1-10.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-11",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 11,
    "titleKey": "level.w1-11.title",
    "board": {
      "width": 4,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 1,
        "y": 2,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 15,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 11
    },
    "teaching": {
      "concept": "backtracking",
      "archetype": "fork",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-11.hint.1",
      "level.w1-11.hint.2",
      "level.w1-11.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-12",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 12,
    "titleKey": "level.w1-12.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "S"
    },
    "goal": {
      "x": 3,
      "y": 3
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 0,
        "y": 3,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 14,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 10
    },
    "teaching": {
      "concept": "debugging-sequence",
      "archetype": "zigzag",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-12.hint.1",
      "level.w1-12.hint.2",
      "level.w1-12.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-13",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 13,
    "titleKey": "level.w1-13.title",
    "board": {
      "width": 3,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 2,
      "y": 2
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 2,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 10,
      "maxActions": 14
    },
    "rating": {
      "parBlocks": 6
    },
    "teaching": {
      "concept": "multiple-solutions",
      "archetype": "diamond",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-13.hint.1",
      "level.w1-13.hint.2",
      "level.w1-13.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-14",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 14,
    "titleKey": "level.w1-14.title",
    "board": {
      "width": 5,
      "height": 2,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "S"
    },
    "goal": {
      "x": 4,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 1,
        "y": 1,
        "kind": "required"
      },
      {
        "id": "b2",
        "x": 3,
        "y": 1,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 9
    },
    "teaching": {
      "concept": "ordering",
      "archetype": "linear-double",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w1-14.hint.1",
      "level.w1-14.hint.2",
      "level.w1-14.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w1-15",
    "revision": 1,
    "worldId": "w1",
    "ordinal": 15,
    "titleKey": "level.w1-15.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        }
      ],
      "decorations": [
        {
          "x": 1,
          "y": 1,
          "kind": "tree"
        },
        {
          "x": 2,
          "y": 1,
          "kind": "tree"
        },
        {
          "x": 1,
          "y": 2,
          "kind": "tree"
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 3
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 3,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 14,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 8
    },
    "teaching": {
      "concept": "transfer",
      "archetype": "meadow-mastery",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w1-15.hint.1",
      "level.w1-15.hint.2",
      "level.w1-15.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-01",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 1,
    "titleKey": "level.w2-01.title",
    "board": {
      "width": 6,
      "height": 1,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 5,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "collectibles": [],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 2,
      "maxActions": 8
    },
    "rating": {
      "parBlocks": 2
    },
    "teaching": {
      "concept": "repeat-count",
      "archetype": "long-stride",
      "difficulty": 1
    },
    "hintKeys": [
      "level.w2-01.hint.1",
      "level.w2-01.hint.2",
      "level.w2-01.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-02",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 2,
    "titleKey": "level.w2-02.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 3
    },
    "collectibles": [],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 5,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 5
    },
    "teaching": {
      "concept": "repeat-body",
      "archetype": "staircase",
      "difficulty": 1
    },
    "hintKeys": [
      "level.w2-02.hint.1",
      "level.w2-02.hint.2",
      "level.w2-02.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-03",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 3,
    "titleKey": "level.w2-03.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 1
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 2
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 4,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 8,
      "maxActions": 14
    },
    "rating": {
      "parBlocks": 5
    },
    "teaching": {
      "concept": "prefix-suffix",
      "archetype": "repeat-corridor",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-03.hint.1",
      "level.w2-03.hint.2",
      "level.w2-03.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-04",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 4,
    "titleKey": "level.w2-04.title",
    "board": {
      "width": 5,
      "height": 5,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 0,
          "y": 4
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 1,
          "y": 4
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 2,
          "y": 4
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 3,
          "y": 4
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 4,
          "y": 4
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 4
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 1,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 10,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 8
    },
    "teaching": {
      "concept": "prefix",
      "archetype": "offset-steps",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-04.hint.1",
      "level.w2-04.hint.2",
      "level.w2-04.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-05",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 5,
    "titleKey": "level.w2-05.title",
    "board": {
      "width": 6,
      "height": 2,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 5,
          "y": 0
        },
        {
          "x": 5,
          "y": 1
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 5,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 6,
      "maxActions": 10
    },
    "rating": {
      "parBlocks": 2
    },
    "teaching": {
      "concept": "repeat-count",
      "archetype": "long-stride",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-05.hint.1",
      "level.w2-05.hint.2",
      "level.w2-05.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-06",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 6,
    "titleKey": "level.w2-06.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 0,
      "y": 1
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 3,
        "y": 3,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 8,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 7
    },
    "teaching": {
      "concept": "rotating-bodies",
      "archetype": "perimeter",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-06.hint.1",
      "level.w2-06.hint.2",
      "level.w2-06.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-07",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 7,
    "titleKey": "level.w2-07.title",
    "board": {
      "width": 6,
      "height": 1,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 5,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 2,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 4,
      "maxActions": 8
    },
    "rating": {
      "parBlocks": 2
    },
    "teaching": {
      "concept": "static-limits",
      "archetype": "tight-stride",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-07.hint.1",
      "level.w2-07.hint.2",
      "level.w2-07.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-08",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 8,
    "titleKey": "level.w2-08.title",
    "board": {
      "width": 5,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 3
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 4,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 8,
      "maxActions": 14
    },
    "rating": {
      "parBlocks": 5
    },
    "teaching": {
      "concept": "mixed-patterns",
      "archetype": "rectangle",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-08.hint.1",
      "level.w2-08.hint.2",
      "level.w2-08.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-09",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 9,
    "titleKey": "level.w2-09.title",
    "board": {
      "width": 6,
      "height": 1,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 5,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 4,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 6,
      "maxActions": 8
    },
    "rating": {
      "parBlocks": 3
    },
    "teaching": {
      "concept": "suffix-reasoning",
      "archetype": "stride-plus-one",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-09.hint.1",
      "level.w2-09.hint.2",
      "level.w2-09.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-10",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 10,
    "titleKey": "level.w2-10.title",
    "board": {
      "width": 5,
      "height": 2,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 0
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 2,
        "y": 1,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 10,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 10
    },
    "teaching": {
      "concept": "bonus-planning",
      "archetype": "zigzag-bonus",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-10.hint.1",
      "level.w2-10.hint.2",
      "level.w2-10.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-11",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 11,
    "titleKey": "level.w2-11.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 3,
      "facing": "N"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 2,
        "y": 1,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 8,
      "maxActions": 14
    },
    "rating": {
      "parBlocks": 6
    },
    "teaching": {
      "concept": "repeat-stairs",
      "archetype": "diagonal-ladder",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-11.hint.1",
      "level.w2-11.hint.2",
      "level.w2-11.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-12",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 12,
    "titleKey": "level.w2-12.title",
    "board": {
      "width": 5,
      "height": 5,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 0,
          "y": 4
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 1,
          "y": 4
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 2,
          "y": 4
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 3,
          "y": 4
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 4,
          "y": 4
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 4
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 2,
        "y": 2,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 11
    },
    "teaching": {
      "concept": "alternating-repeats",
      "archetype": "snake",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-12.hint.1",
      "level.w2-12.hint.2",
      "level.w2-12.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-13",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 13,
    "titleKey": "level.w2-13.title",
    "board": {
      "width": 6,
      "height": 6,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 0,
          "y": 4
        },
        {
          "x": 0,
          "y": 5
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 1,
          "y": 4
        },
        {
          "x": 1,
          "y": 5
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 2,
          "y": 4
        },
        {
          "x": 2,
          "y": 5
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 3,
          "y": 4
        },
        {
          "x": 3,
          "y": 5
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 4,
          "y": 4
        },
        {
          "x": 4,
          "y": 5
        },
        {
          "x": 5,
          "y": 0
        },
        {
          "x": 5,
          "y": 1
        },
        {
          "x": 5,
          "y": 2
        },
        {
          "x": 5,
          "y": 3
        },
        {
          "x": 5,
          "y": 4
        },
        {
          "x": 5,
          "y": 5
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 5
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 5,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 8,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 5
    },
    "teaching": {
      "concept": "sequential-loops",
      "archetype": "double-stride",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-13.hint.1",
      "level.w2-13.hint.2",
      "level.w2-13.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-14",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 14,
    "titleKey": "level.w2-14.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 1
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 4,
        "y": 2,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 9
    },
    "teaching": {
      "concept": "loop-with-detour",
      "archetype": "detour-loop",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w2-14.hint.1",
      "level.w2-14.hint.2",
      "level.w2-14.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w2-15",
    "revision": 1,
    "worldId": "w2",
    "ordinal": 15,
    "titleKey": "level.w2-15.title",
    "board": {
      "width": 6,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 5,
          "y": 0
        },
        {
          "x": 5,
          "y": 1
        },
        {
          "x": 5,
          "y": 2
        },
        {
          "x": 5,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 1
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 3
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 5,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 5
    },
    "teaching": {
      "concept": "mastery-repeat",
      "archetype": "workshop-complex",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w2-15.hint.1",
      "level.w2-15.hint.2",
      "level.w2-15.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-01",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 1,
    "titleKey": "level.w3-01.title",
    "board": {
      "width": 3,
      "height": 2,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 1
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 2,
      "y": 0
    },
    "collectibles": [],
    "gates": [
      {
        "id": "gate-a",
        "x": 1,
        "y": 0
      }
    ],
    "switches": [
      {
        "id": "switch-a",
        "x": 0,
        "y": 1,
        "opens": [
          "gate-a"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 10,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 8
    },
    "teaching": {
      "concept": "latched-switch",
      "archetype": "switch-backtrack",
      "difficulty": 1
    },
    "hintKeys": [
      "level.w3-01.hint.1",
      "level.w3-01.hint.2",
      "level.w3-01.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-02",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 2,
    "titleKey": "level.w3-02.title",
    "board": {
      "width": 4,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 2,
      "facing": "N"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [
      {
        "id": "item-1",
        "x": 2,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [
      {
        "id": "gate-a",
        "x": 1,
        "y": 0
      },
      {
        "id": "gate-b",
        "x": 3,
        "y": 1
      }
    ],
    "switches": [
      {
        "id": "switch-a",
        "x": 0,
        "y": 1,
        "opens": [
          "gate-a"
        ]
      },
      {
        "id": "switch-b",
        "x": 2,
        "y": 0,
        "opens": [
          "gate-b"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 14,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 11
    },
    "teaching": {
      "concept": "switch-order",
      "archetype": "two-gate-route",
      "difficulty": 1
    },
    "hintKeys": [
      "level.w3-02.hint.1",
      "level.w3-02.hint.2",
      "level.w3-02.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-03",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 3,
    "titleKey": "level.w3-03.title",
    "board": {
      "width": 5,
      "height": 2,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 0
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 0,
        "y": 1,
        "kind": "bonus"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 3,
        "y": 0
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 2,
        "y": 1,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 18
    },
    "rating": {
      "parBlocks": 10
    },
    "teaching": {
      "concept": "switch-sequence",
      "archetype": "linear-switch",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-03.hint.1",
      "level.w3-03.hint.2",
      "level.w3-03.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-04",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 4,
    "titleKey": "level.w3-04.title",
    "board": {
      "width": 4,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 1
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 1,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 2
    },
    "collectibles": [],
    "gates": [
      {
        "id": "g1",
        "x": 3,
        "y": 1
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 1,
        "y": 0,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 14,
      "maxActions": 18
    },
    "rating": {
      "parBlocks": 12
    },
    "teaching": {
      "concept": "side-switch",
      "archetype": "corridor-switch",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-04.hint.1",
      "level.w3-04.hint.2",
      "level.w3-04.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-05",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 5,
    "titleKey": "level.w3-05.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 2,
        "y": 2,
        "kind": "required"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 2,
        "y": 0
      },
      {
        "id": "g2",
        "x": 3,
        "y": 0
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 0,
        "y": 2,
        "opens": [
          "g1",
          "g2"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 14,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 13
    },
    "teaching": {
      "concept": "multi-gate",
      "archetype": "twin-gates",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-05.hint.1",
      "level.w3-05.hint.2",
      "level.w3-05.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-06",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 6,
    "titleKey": "level.w3-06.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        }
      ],
      "decorations": [
        {
          "x": 1,
          "y": 1,
          "kind": "tree"
        },
        {
          "x": 2,
          "y": 2,
          "kind": "tree"
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [],
    "gates": [
      {
        "id": "g1",
        "x": 2,
        "y": 0
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 0,
        "y": 3,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 16,
      "maxActions": 22
    },
    "rating": {
      "parBlocks": 12
    },
    "teaching": {
      "concept": "gate-loop",
      "archetype": "loop-gate",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-06.hint.1",
      "level.w3-06.hint.2",
      "level.w3-06.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-07",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 7,
    "titleKey": "level.w3-07.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 1,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 1
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 2,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 3,
        "y": 1
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 2,
        "y": 0,
        "opens": [
          "g1"
        ]
      },
      {
        "id": "sw2",
        "x": 2,
        "y": 2,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 10,
      "maxActions": 16
    },
    "rating": {
      "parBlocks": 10
    },
    "teaching": {
      "concept": "redundant-switch",
      "archetype": "choice-switch",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-07.hint.1",
      "level.w3-07.hint.2",
      "level.w3-07.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-08",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 8,
    "titleKey": "level.w3-08.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 1
    },
    "collectibles": [],
    "gates": [
      {
        "id": "g1",
        "x": 2,
        "y": 0
      },
      {
        "id": "g2",
        "x": 4,
        "y": 0
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 1,
        "y": 2,
        "opens": [
          "g1"
        ]
      },
      {
        "id": "sw2",
        "x": 3,
        "y": 2,
        "opens": [
          "g2"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 18,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 15
    },
    "teaching": {
      "concept": "gate-ordering",
      "archetype": "chained-gates",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-08.hint.1",
      "level.w3-08.hint.2",
      "level.w3-08.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-09",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 9,
    "titleKey": "level.w3-09.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 3,
        "y": 3,
        "kind": "required"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 2,
        "y": 0
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 0,
        "y": 3,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 16,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 13
    },
    "teaching": {
      "concept": "maze-routing",
      "archetype": "switch-maze",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-09.hint.1",
      "level.w3-09.hint.2",
      "level.w3-09.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-10",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 10,
    "titleKey": "level.w3-10.title",
    "board": {
      "width": 4,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 2,
        "y": 1,
        "kind": "required"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 1,
        "y": 1
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 0,
        "y": 2,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 14,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 13
    },
    "teaching": {
      "concept": "gate-containment",
      "archetype": "enclosed-item",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-10.hint.1",
      "level.w3-10.hint.2",
      "level.w3-10.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-11",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 11,
    "titleKey": "level.w3-11.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 0
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 2,
        "y": 2,
        "kind": "bonus"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 2,
        "y": 1
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 4,
        "y": 2,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 18,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 11
    },
    "teaching": {
      "concept": "bonus-behind-gate",
      "archetype": "gate-bonus",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-11.hint.1",
      "level.w3-11.hint.2",
      "level.w3-11.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-12",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 12,
    "titleKey": "level.w3-12.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 1
    },
    "collectibles": [],
    "gates": [
      {
        "id": "g1",
        "x": 3,
        "y": 0
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 3,
        "y": 3,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 14,
      "maxActions": 18
    },
    "rating": {
      "parBlocks": 11
    },
    "teaching": {
      "concept": "loop-switch",
      "archetype": "roundabout",
      "difficulty": 2
    },
    "hintKeys": [
      "level.w3-12.hint.1",
      "level.w3-12.hint.2",
      "level.w3-12.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-13",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 13,
    "titleKey": "level.w3-13.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 0
    },
    "collectibles": [],
    "gates": [
      {
        "id": "g1",
        "x": 1,
        "y": 0
      },
      {
        "id": "g2",
        "x": 2,
        "y": 0
      },
      {
        "id": "g3",
        "x": 3,
        "y": 0
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 0,
        "y": 2,
        "opens": [
          "g1",
          "g2",
          "g3"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 16,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 12
    },
    "teaching": {
      "concept": "triple-gates",
      "archetype": "gate-sequence",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w3-13.hint.1",
      "level.w3-13.hint.2",
      "level.w3-13.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-14",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 14,
    "titleKey": "level.w3-14.title",
    "board": {
      "width": 5,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 3
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 0,
        "y": 3,
        "kind": "required"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 4,
        "y": 1
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 4,
        "y": 0,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right"
    ],
    "limits": {
      "maxBlocks": 20,
      "maxActions": 26
    },
    "rating": {
      "parBlocks": 19
    },
    "teaching": {
      "concept": "barrier-planning",
      "archetype": "double-barrier",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w3-14.hint.1",
      "level.w3-14.hint.2",
      "level.w3-14.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w3-15",
    "revision": 1,
    "worldId": "w3",
    "ordinal": 15,
    "titleKey": "level.w3-15.title",
    "board": {
      "width": 5,
      "height": 5,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 0,
          "y": 4
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 1,
          "y": 4
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 2,
          "y": 4
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 3,
          "y": 4
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 4,
          "y": 4
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 2
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 4
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 4,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 4,
        "y": 2
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 2,
        "y": 0,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 14,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 8
    },
    "teaching": {
      "concept": "switch-gate-synthesis",
      "archetype": "crystal-mastery",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w3-15.hint.1",
      "level.w3-15.hint.2",
      "level.w3-15.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-01",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 1,
    "titleKey": "level.w4-01.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 2
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 3,
        "y": 2,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 8
    },
    "teaching": {
      "concept": "transfer",
      "archetype": "two-islands-bridge",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-01.hint.1",
      "level.w4-01.hint.2",
      "level.w4-01.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-02",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 2,
    "titleKey": "level.w4-02.title",
    "board": {
      "width": 4,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 3
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 0,
        "y": 3,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 8
    },
    "teaching": {
      "concept": "bonus-ordering",
      "archetype": "ring-perimeter",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-02.hint.1",
      "level.w4-02.hint.2",
      "level.w4-02.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-03",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 3,
    "titleKey": "level.w4-03.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 2
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 4,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 3,
        "y": 2
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 0,
        "y": 2,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 22,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 20
    },
    "teaching": {
      "concept": "gate-transfer",
      "archetype": "spur-switch",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-03.hint.1",
      "level.w4-03.hint.2",
      "level.w4-03.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-04",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 4,
    "titleKey": "level.w4-04.title",
    "board": {
      "width": 6,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 5,
          "y": 0
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 5,
          "y": 2
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 4,
          "y": 1
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 2
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 3,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 1,
        "y": 2
      },
      {
        "id": "g2",
        "x": 4,
        "y": 2
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 1,
        "y": 1,
        "opens": [
          "g1"
        ]
      },
      {
        "id": "sw2",
        "x": 4,
        "y": 1,
        "opens": [
          "g2"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 9
    },
    "teaching": {
      "concept": "switch-ordering",
      "archetype": "two-gates",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-04.hint.1",
      "level.w4-04.hint.2",
      "level.w4-04.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-05",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 5,
    "titleKey": "level.w4-05.title",
    "board": {
      "width": 5,
      "height": 5,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 4,
          "y": 4
        },
        {
          "x": 3,
          "y": 4
        },
        {
          "x": 2,
          "y": 4
        },
        {
          "x": 1,
          "y": 4
        },
        {
          "x": 0,
          "y": 4
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 2,
      "y": 3
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 0,
        "y": 4,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 22,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 20
    },
    "teaching": {
      "concept": "route-planning",
      "archetype": "spiral-inward",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-05.hint.1",
      "level.w4-05.hint.2",
      "level.w4-05.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-06",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 6,
    "titleKey": "level.w4-06.title",
    "board": {
      "width": 5,
      "height": 5,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 3,
          "y": 4
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 4,
          "y": 4
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 0,
          "y": 4
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 1,
          "y": 4
        },
        {
          "x": 0,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 1,
      "y": 4
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 4,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 22,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 20
    },
    "teaching": {
      "concept": "multi-island",
      "archetype": "zigzag-bridges",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-06.hint.1",
      "level.w4-06.hint.2",
      "level.w4-06.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-07",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 7,
    "titleKey": "level.w4-07.title",
    "board": {
      "width": 8,
      "height": 1,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 5,
          "y": 0
        },
        {
          "x": 6,
          "y": 0
        },
        {
          "x": 7,
          "y": 0
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 7,
      "y": 0
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 3,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 7
    },
    "teaching": {
      "concept": "repeat-synthesis",
      "archetype": "long-corridor",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-07.hint.1",
      "level.w4-07.hint.2",
      "level.w4-07.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-08",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 8,
    "titleKey": "level.w4-08.title",
    "board": {
      "width": 5,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 0
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 3,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 0
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 0,
        "y": 0,
        "kind": "bonus"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 4,
        "y": 1
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 2,
        "y": 2,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 18,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 16
    },
    "teaching": {
      "concept": "gate-maze",
      "archetype": "corner-gate",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-08.hint.1",
      "level.w4-08.hint.2",
      "level.w4-08.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-09",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 9,
    "titleKey": "level.w4-09.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 1,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 1
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 4,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 12,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 9
    },
    "teaching": {
      "concept": "backtracking",
      "archetype": "dead-end-spur",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-09.hint.1",
      "level.w4-09.hint.2",
      "level.w4-09.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-10",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 10,
    "titleKey": "level.w4-10.title",
    "board": {
      "width": 6,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 5,
          "y": 0
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 5,
          "y": 2
        },
        {
          "x": 2,
          "y": 1
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 2
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 3,
        "y": 0,
        "kind": "required"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 3,
        "y": 2
      },
      {
        "id": "g2",
        "x": 4,
        "y": 2
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 2,
        "y": 1,
        "opens": [
          "g1",
          "g2"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 15,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 13
    },
    "teaching": {
      "concept": "multi-gate",
      "archetype": "one-switch-two-gates",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-10.hint.1",
      "level.w4-10.hint.2",
      "level.w4-10.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-11",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 11,
    "titleKey": "level.w4-11.title",
    "board": {
      "width": 5,
      "height": 5,
      "tiles": [
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 2,
          "y": 4
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 2,
      "y": 0,
      "facing": "S"
    },
    "goal": {
      "x": 0,
      "y": 2
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 2,
        "y": 4,
        "kind": "required"
      },
      {
        "id": "s1",
        "x": 4,
        "y": 2,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 19,
      "maxActions": 21
    },
    "rating": {
      "parBlocks": 17
    },
    "teaching": {
      "concept": "ordering",
      "archetype": "plus-shape",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-11.hint.1",
      "level.w4-11.hint.2",
      "level.w4-11.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-12",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 12,
    "titleKey": "level.w4-12.title",
    "board": {
      "width": 6,
      "height": 5,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 0,
          "y": 4
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 1,
          "y": 4
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 2,
          "y": 4
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 3,
          "y": 4
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 4,
          "y": 4
        },
        {
          "x": 5,
          "y": 0
        },
        {
          "x": 5,
          "y": 1
        },
        {
          "x": 5,
          "y": 2
        },
        {
          "x": 5,
          "y": 3
        },
        {
          "x": 5,
          "y": 4
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 2,
          "y": 4
        },
        {
          "x": 3,
          "y": 4
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 3,
      "y": 3
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 5,
        "y": 4,
        "kind": "bonus"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 4,
        "y": 3
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 1,
        "y": 3,
        "opens": [
          "g1"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 26,
      "maxActions": 28
    },
    "rating": {
      "parBlocks": 24
    },
    "teaching": {
      "concept": "ring-gate",
      "archetype": "ring-inner-chamber",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-12.hint.1",
      "level.w4-12.hint.2",
      "level.w4-12.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-13",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 13,
    "titleKey": "level.w4-13.title",
    "board": {
      "width": 7,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 5,
          "y": 3
        },
        {
          "x": 6,
          "y": 3
        },
        {
          "x": 3,
          "y": 2
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 6,
      "y": 3
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 4,
        "y": 1,
        "kind": "required"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 15,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 13
    },
    "teaching": {
      "concept": "island-chain",
      "archetype": "staircase-islands",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-13.hint.1",
      "level.w4-13.hint.2",
      "level.w4-13.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-14",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 14,
    "titleKey": "level.w4-14.title",
    "board": {
      "width": 6,
      "height": 4,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 0,
          "y": 1
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 0,
          "y": 3
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 1,
          "y": 1
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 1,
          "y": 3
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 2,
          "y": 3
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 3,
          "y": 1
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 3,
          "y": 3
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 4,
          "y": 1
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 4,
          "y": 3
        },
        {
          "x": 5,
          "y": 0
        },
        {
          "x": 5,
          "y": 1
        },
        {
          "x": 5,
          "y": 2
        },
        {
          "x": 5,
          "y": 3
        }
      ],
      "walls": [
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 2,
          "y": 1
        },
        {
          "x": 2,
          "y": 2
        }
      ]
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 5,
      "y": 0
    },
    "collectibles": [
      {
        "id": "s1",
        "x": 5,
        "y": 3,
        "kind": "bonus"
      }
    ],
    "gates": [],
    "switches": [],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 16,
      "maxActions": 20
    },
    "rating": {
      "parBlocks": 14
    },
    "teaching": {
      "concept": "walled-detour",
      "archetype": "perimeter-detour",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-14.hint.1",
      "level.w4-14.hint.2",
      "level.w4-14.hint.3"
    ]
  },
  {
    "schemaVersion": 1,
    "engineRulesVersion": 1,
    "id": "w4-15",
    "revision": 1,
    "worldId": "w4",
    "ordinal": 15,
    "titleKey": "level.w4-15.title",
    "board": {
      "width": 5,
      "height": 3,
      "tiles": [
        {
          "x": 0,
          "y": 0
        },
        {
          "x": 1,
          "y": 0
        },
        {
          "x": 2,
          "y": 0
        },
        {
          "x": 3,
          "y": 0
        },
        {
          "x": 4,
          "y": 0
        },
        {
          "x": 0,
          "y": 2
        },
        {
          "x": 1,
          "y": 2
        },
        {
          "x": 2,
          "y": 2
        },
        {
          "x": 3,
          "y": 2
        },
        {
          "x": 4,
          "y": 2
        },
        {
          "x": 2,
          "y": 1
        }
      ],
      "walls": []
    },
    "start": {
      "x": 0,
      "y": 0,
      "facing": "E"
    },
    "goal": {
      "x": 4,
      "y": 2
    },
    "collectibles": [
      {
        "id": "b1",
        "x": 4,
        "y": 0,
        "kind": "required"
      },
      {
        "id": "s1",
        "x": 0,
        "y": 2,
        "kind": "bonus"
      }
    ],
    "gates": [
      {
        "id": "g1",
        "x": 1,
        "y": 2
      },
      {
        "id": "g2",
        "x": 3,
        "y": 2
      }
    ],
    "switches": [
      {
        "id": "sw1",
        "x": 3,
        "y": 0,
        "opens": [
          "g1"
        ]
      },
      {
        "id": "sw2",
        "x": 2,
        "y": 2,
        "opens": [
          "g2"
        ]
      }
    ],
    "commands": [
      "forward",
      "left",
      "right",
      "repeat"
    ],
    "limits": {
      "maxBlocks": 22,
      "maxActions": 24
    },
    "rating": {
      "parBlocks": 20
    },
    "teaching": {
      "concept": "full-synthesis",
      "archetype": "grand-synthesis",
      "difficulty": 3
    },
    "hintKeys": [
      "level.w4-15.hint.1",
      "level.w4-15.hint.2",
      "level.w4-15.hint.3"
    ]
  }
] as const;
