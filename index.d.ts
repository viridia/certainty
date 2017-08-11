// Type definitions for rethinkdb-job-queue
// Project: https://github.com/viridia/certainty
export interface FailureStrategy {
  fail(msg: string): void;
}

export interface SubjectFactory {
  addType(typeTest: (value: any) => boolean, subjectClass: any): void;
  newSubject(failureStrategy: FailureStrategy, value: any): Subject;
}

export class Subject {
  public describe(): string;
  public fail(msg: string): void;
  public failEqual(expected: any): void;
  public failNotEqual(expected: any): void;
  public failComparison(verb: string, expected: any): void;
  public named(name: string): this;
  public withFailureMessage(msg: string): this;
  public isTrue(): this;
  public isFalse(): this;
  public isTruthy(): this;
  public isFalsey(): this;
  public isNull(): this;
  public isNotNull(): this;
  public isUndefined(): this;
  public isNotUndefined(): this;
  public isNullOrUndefined(): this;
  public isNotNullOrUndefined(): this;
  public exists(): this;
  public isEqualTo(expected: any): this;
  public equals(expected: any): this;
  public isNotEqualTo(expected: any): this;
  public isExactly(expected: any): this;
  public isDeeplyEqualTo(expected: any): this;
  public isNotDeeplyEqualTo(expected: any): this;
  public isGreaterThan(expected: any): this;
  public isNotGreaterThan(expected: any): this;
  public isLessThan(expected: any): this;
  public isNotLessThan(expected: any): this;
  public isInstanceOf(expected: any): this;
  public isNotInstanceOf(expected: any): this;
  public hasType(expected: string): this;
  public isIn(collection: any): this;
  public is(verb: string, testFn: (value: any) => boolean): this;
  public isNot(verb: string, testFn: (value: any) => boolean): this;

  // ArraySubject
  // public isEmpty(): this;
  // public isNotEmpty(): this;
  // public hasLength(length: number): this;
  // public contains(element: any): this;
  // public doesNotContain(element: any): this;
  // public containsAllOf(...elements: any[]): InOrder;
  // public containsExactly(...elements: any[]): InOrder;
  // public containsAnyOf(...elements: any[]): this;
  // public containsNoneOf(...elements: any[]): this;
  // public containsAllIn(elements: any[]): InOrder;
  // public containsExactlyIn(elements: any[]): InOrder;
  // public containsAnyIn(elements: any[]): this;
  // public containsNoneIn(elements: any[]): this;
  // public containsAny(verb: string, testFn: (value: any) => boolean): this;
  // public containsAll(verb: string, testFn: (value: any) => boolean): this;
  // public containsNone(verb: string, testFn: (value: any) => boolean): this;
  // public eachElement(): Subject; // TypeScript can't infer return type

  // ObjectSubject
  // public hasField(fieldName: string): FieldValue;
  // public doesNotHaveField(fieldName: string): this;
  // public hasOwnField(fieldName: string): FieldValue;
  // public doesNotHaveOwnField(fieldName: string): this;

  constructor(failureStrategy: FailureStrategy, value: any);
}

export interface BooleanSubject extends Subject {}
export interface NumberSubject extends Subject {}

export class StringSubject extends Subject {
  public isEmpty(): this;
  public isNotEmpty(): this;
  public includes(expected: string): this;
  public doesNotInclude(expected: string): this;
  public startsWith(expected: string): this;
  public endsWith(expected: string): this;
  public matches(regex: RegExp): this;
}

export class ArraySubject extends Subject {
  public isEmpty(): this;
  public isNotEmpty(): this;
  public hasLength(length: number): this;
  public contains(element: any): this;
  public doesNotContain(element: any): this;
  public containsAllOf(...elements: any[]): InOrder;
  public containsExactly(...elements: any[]): InOrder;
  public containsAnyOf(...elements: any[]): this;
  public containsNoneOf(...elements: any[]): this;
  public containsAllIn(elements: any[]): InOrder;
  public containsExactlyIn(elements: any[]): InOrder;
  public containsAnyIn(elements: any[]): this;
  public containsNoneIn(elements: any[]): this;
  public containsAny(verb: string, testFn: (value: any) => boolean): this;
  public containsAll(verb: string, testFn: (value: any) => boolean): this;
  public containsNone(verb: string, testFn: (value: any) => boolean): this;
  public eachElement(): Subject; // Can't infer return type from element
}

export class ObjectSubject extends Subject {
  public isEmpty(): this;
  public isNotEmpty(): this;
  public hasField(fieldName: string): FieldValue;
  public doesNotHaveField(fieldName: string): this;
  public hasOwnField(fieldName: string): FieldValue;
  public doesNotHaveOwnField(fieldName: string): this;
}

export interface FieldValue {
  withValue(expected: any): void;
}

export interface InOrder {
  inOrder(): void;
}

export class PromiseSubject<P> extends Subject {
  public succeeds(): this;
  public succeedsWith(expected: any): this;
  public fails(): this;
  public failsWith(expected: any): this;
  public eventually(): any; // TypeScript can't infer return type
}

export interface Verb {
  // TypeScript doesn't support matching on ES6 types? (some versions?)
  // (subject: Set<any>): SetSubject;
  // (subject: Map<any, any>): MapSubject;
  <P>(subject: Promise<P>): PromiseSubject<P>;
  (subject: any[]): ArraySubject;
  (subject: string): StringSubject;
  (subject: object): ObjectSubject & ArraySubject; // it might be an array
  // If type is unknown, assume it can be any known type.
  (subject: any): Subject & StringSubject & ArraySubject & ObjectSubject;
}

export const ensure: Verb;
export const expect: Verb;
