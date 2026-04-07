import { learnerUnits } from "@/features/learner/model";
import { Card, Body, Bullet, H1, NavButton, Screen } from "@/ui/primitives";

export default function LearnerScreen() {
  return (
    <Screen>
      <Card>
        <H1>수지 학습 세션</H1>
        <Body>
          자유형 튜터처럼 보이되, 내부적으로는 막힌 지점과 회복 단서를 기록하는
          세션 구조를 쓴다.
        </Body>
      </Card>

      <Card>
        <H1>중1 우선 단원</H1>
        {learnerUnits.map((unit) => (
          <Bullet key={unit.id}>
            {unit.title} - {unit.hook}
          </Bullet>
        ))}
      </Card>

      <NavButton href="/expert-reports" label="전문가 보고 구조 보기" />
    </Screen>
  );
}
