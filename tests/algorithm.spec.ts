import { test, expect } from '@playwright/test';
import { evaluateBestDestination } from '../src/lib/algorithm';

test.describe('Algoritmo de Destino Óptimo (Min-Max y Desempate)', () => {
  test('Selecciona el destino con el menor tiempo máximo de viaje', () => {
    const destinations = [
      { id: 'dest-1', lat: 0, lng: 0 },
      { id: 'dest-2', lat: 0, lng: 0 },
    ];
    // participant A, participant B
    const matrix = [
      {
        elements: [
          { status: 'OK', duration: { value: 20 } }, // To dest-1
          { status: 'OK', duration: { value: 30 } }, // To dest-2
        ],
      },
      {
        elements: [
          { status: 'OK', duration: { value: 15 } }, // To dest-1
          { status: 'OK', duration: { value: 10 } }, // To dest-2
        ],
      },
    ];

    // Dest 1: max 20, Dest 2: max 30. Should pick dest-1.
    const result = evaluateBestDestination(destinations, matrix as any);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('dest-1');
    expect(result!.maxDuration).toBe(20);
  });

  test('Desempata por el menor promedio si hay empate en máximo', () => {
    // Dest 1: A(20), B(10) -> max: 20, avg: 15
    // Dest 2: A(25), B(5)  -> max: 25, avg: 15
    // Dest 3: A(12), B(20) -> max: 20, avg: 16
    const destinations = [
      { id: 'dest-1', lat: 0, lng: 0 },
      { id: 'dest-2', lat: 0, lng: 0 },
      { id: 'dest-3', lat: 0, lng: 0 },
    ];
    
    const matrix = [
      {
        elements: [
          { status: 'OK', duration: { value: 20 } }, // To dest-1 (A)
          { status: 'OK', duration: { value: 25 } }, // To dest-2 (A)
          { status: 'OK', duration: { value: 12 } }, // To dest-3 (A)
        ],
      },
      {
        elements: [
          { status: 'OK', duration: { value: 10 } }, // To dest-1 (B)
          { status: 'OK', duration: { value: 5 } },  // To dest-2 (B)
          { status: 'OK', duration: { value: 20 } }, // To dest-3 (B)
        ],
      },
    ];

    const result = evaluateBestDestination(destinations, matrix as any);
    // Picks Dest 1 because it ties with Dest 3 on max (20), but has better average (15 vs 16)
    expect(result).not.toBeNull();
    expect(result!.id).toBe('dest-1');
  });

  test('Filtra rutas inviables (ZERO_RESULTS) para cualquier participante', () => {
    const destinations = [
      { id: 'dest-valid', lat: 0, lng: 0 },
      { id: 'dest-invalid', lat: 0, lng: 0 },
    ];
    
    const matrix = [
      {
        elements: [
          { status: 'OK', duration: { value: 10 } },
          { status: 'ZERO_RESULTS', duration: { value: 0 } }, // Unreachable for A
        ],
      },
      {
        elements: [
          { status: 'OK', duration: { value: 10 } },
          { status: 'OK', duration: { value: 5 } }, // Reachable for B
        ],
      },
    ];

    const result = evaluateBestDestination(destinations, matrix as any);
    expect(result).not.toBeNull();
    expect(result!.id).toBe('dest-valid');
  });

  test('Retorna null si ningún destino es accesible', () => {
    const destinations = [
      { id: 'dest-invalid-1', lat: 0, lng: 0 },
      { id: 'dest-invalid-2', lat: 0, lng: 0 },
    ];
    
    const matrix = [
      {
        elements: [
          { status: 'ZERO_RESULTS', duration: { value: 0 } },
          { status: 'OK', duration: { value: 10 } },
        ],
      },
      {
        elements: [
          { status: 'OK', duration: { value: 10 } },
          { status: 'ZERO_RESULTS', duration: { value: 0 } },
        ],
      },
    ];

    const result = evaluateBestDestination(destinations, matrix as any);
    expect(result).toBeNull();
  });
});
