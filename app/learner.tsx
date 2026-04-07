import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { loadCachedLearners } from "@/features/auth/storage";
import { learnerUnits } from "@/features/learner/model";
import { verifyLearnerPin, runTutorSessionTurn } from "@/features/tutor/api";
import {
  appendTutorReplyToTranscript,
  type TutorTranscriptEntry,
} from "@/features/tutor/model";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import {
  ActionButton,
  Body,
  Bullet,
  Caption,
  Card,
  FieldLabel,
  H1,
  InputField,
  NavButton,
  Screen,
} from "@/ui/primitives";

export default function LearnerScreen() {
  const [cachedLearners, setCachedLearners] = useState<
    Awaited<ReturnType<typeof loadCachedLearners>>
  >([]);
  const [selectedLearnerId, setSelectedLearnerId] = useState("");
  const [learnerPin, setLearnerPin] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    learnerUnits[0]?.id ?? "",
  );
  const [sessionToken, setSessionToken] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [learnerMessage, setLearnerMessage] = useState("");
  const [transcript, setTranscript] = useState<TutorTranscriptEntry[]>([]);
  const [reportPreview, setReportPreview] = useState<string>("");
  const [status, setStatus] = useState("학습자 PIN을 확인하면 실AI 세션을 시작한다.");
  const [isBusy, setIsBusy] = useState(false);

  const selectedLearner = useMemo(
    () => cachedLearners.find((learner) => learner.id === selectedLearnerId),
    [cachedLearners, selectedLearnerId],
  );

  useEffect(() => {
    loadCachedLearners()
      .then((learners) => {
        setCachedLearners(learners);
        if (!selectedLearnerId && learners[0]) {
          setSelectedLearnerId(learners[0].id);
        }
      })
      .catch((error) => {
        setStatus(error instanceof Error ? error.message : "학습자 캐시를 읽지 못했다.");
      });
  }, []);

  async function runWithStatus(action: () => Promise<void>) {
    try {
      setIsBusy(true);
      await action();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "요청에 실패했다.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <Screen>
      <Card>
        <H1>수지 학습 세션</H1>
        <Body>
          자유형 튜터처럼 보이되, 내부적으로는 막힌 지점과 회복 단서를 기록하는
          세션 구조를 쓴다.
        </Body>
        <Caption>
          {hasPublicSupabaseEnv()
            ? "Edge Function 경유 실AI 호출 경로 준비됨"
            : "공개 Supabase 설정이 없어 실AI 호출은 비활성 상태"}
        </Caption>
      </Card>

      <Card>
        <H1>학습자 선택과 PIN</H1>
        {cachedLearners.length === 0 ? (
          <Body>부모 화면에서 학습자 프로필을 먼저 만들고 동기화해야 한다.</Body>
        ) : (
          <>
            <View style={styles.buttonColumn}>
              {cachedLearners.map((learner) => (
                <ActionButton
                  key={learner.id}
                  label={`${learner.learner_name} / ${learner.pin_hint}`}
                  variant={
                    selectedLearnerId === learner.id ? "primary" : "secondary"
                  }
                  onPress={() => setSelectedLearnerId(learner.id)}
                />
              ))}
            </View>
            <FieldLabel>PIN</FieldLabel>
            <InputField
              keyboardType="number-pad"
              onChangeText={setLearnerPin}
              value={learnerPin}
              placeholder="1234"
            />
            <ActionButton
              label="PIN 확인"
              disabled={
                isBusy || !hasPublicSupabaseEnv() || !selectedLearnerId
              }
              onPress={() =>
                runWithStatus(async () => {
                  const learnerSession = await verifyLearnerPin(
                    selectedLearnerId,
                    learnerPin,
                  );
                  setSessionToken(learnerSession.sessionToken);
                  setStatus(
                    `${learnerSession.learnerName}의 PIN 확인 완료. ${learnerSession.grade} 세션 준비됨.`,
                  );
                })
              }
            />
          </>
        )}
      </Card>

      <Card>
        <H1>단원과 질문</H1>
        <View style={styles.buttonColumn}>
          {learnerUnits.map((unit) => (
            <ActionButton
              key={unit.id}
              label={`${unit.title} - ${unit.hook}`}
              variant={selectedUnitId === unit.id ? "primary" : "secondary"}
              onPress={() => setSelectedUnitId(unit.id)}
            />
          ))}
        </View>
        <FieldLabel>수지의 현재 질문</FieldLabel>
        <InputField
          multiline
          onChangeText={setLearnerMessage}
          value={learnerMessage}
          placeholder="어디서 시작해야 할지 모르겠어."
          style={styles.multiline}
        />
        <ActionButton
          label="튜터에게 보내기"
          disabled={isBusy || !sessionToken || !hasPublicSupabaseEnv()}
          onPress={() =>
            runWithStatus(async () => {
              const result = await runTutorSessionTurn({
                sessionToken,
                sessionId,
                unitId: selectedUnitId,
                learnerMessage,
              });
              setSessionId(result.sessionId);
              setTranscript((previous) =>
                appendTutorReplyToTranscript(
                  previous,
                  learnerMessage.trim(),
                  result.tutorReply,
                ),
              );
              setReportPreview(result.parentReport.sessionSummary);
              setLearnerMessage("");
              setStatus(
                `${selectedLearner?.learner_name ?? "학습자"} 세션에 답변을 추가했다.`,
              );
            })
          }
        />
      </Card>

      <Card>
        <H1>대화 기록</H1>
        {transcript.length === 0 ? (
          <Body>아직 전송된 대화가 없다.</Body>
        ) : (
          transcript.map((item, index) => (
            <Bullet key={`${item.role}-${index}`}>
              [{item.role}] {item.text}
            </Bullet>
          ))
        )}
      </Card>

      <Card>
        <H1>부모 리포트 프리뷰</H1>
        <Body>{reportPreview || "첫 tutor turn 이후 요약이 생성된다."}</Body>
      </Card>

      <Card>
        <H1>상태</H1>
        <Body>{status}</Body>
      </Card>

      <NavButton href="/expert-reports" label="전문가 보고 구조 보기" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttonColumn: {
    gap: 8,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
});
